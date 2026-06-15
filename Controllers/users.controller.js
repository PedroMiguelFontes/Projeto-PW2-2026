const mongoose = require('mongoose');
const User = require('../Models/users.schema');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

const resolveUserQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByField = async (req, res) => {
    try {
        const {field, value} = req.query;
        const query = {};
        query[field] = value;
        const users = await User.find(query).select('-password');
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Utilizador não existe" });
        }

        return res.status(200).json(users);
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const query = resolveUserQuery(req.params.id);
        const user = await User.findOne(query).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Utilizador não existe" });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { nome, email, password, tipo } = req.body;
        if (!nome || !email || !password || !tipo) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email já está em uso" });
        }

        if ((tipo === 'Utilizador') && !email.endsWith('@esmad.ipp.pt')) {
                return res.status(400).json({message: 'Estudantes/Docentes devem usar email institucional (@esmad.ipp.pt)'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Formato de email inválido"
            });
        }

        const lastUser = await User.findOne().sort({ id: -1 });
        const nextId = (lastUser?.id || 0) + 1;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            id: nextId,
            nome,
            email,
            password: hashedPassword,
            tipo,
            estado:'Ativo'
        });
        

        console.log(req.body);
        console.log(tipo);
        console.log(newUser);

        const savedUser = await newUser.save();
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse);
    } catch (error) {
        if (error.name === 'ValidationError') {
        return res.status(400).json({
            message: error.message
        });
    }


        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {  
    if (req.params.id!==req.loggedUserId) {
        return res.status(403).json({ message: 'Só pode alterar a sua própria conta.' });
    } else {
    try {
        const { nome, email, password, tipo, estado } = req.body;
        const updateData = { nome, email, tipo, estado, updated_at: Date.now() };
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const query = resolveUserQuery(req.params.id);
        const updatedUser = await User.findOneAndUpdate(
            query,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Utilizador não existe" });
        }
        
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}
};

const suspendUser = async (req, res) => {
    if (req.loggedUserRole !== 'Admin') {
        return res.status(403).json({ message: 'Não tem permissões para suspender este utilizador.' });
    }
    try {
        const query = resolveUserQuery(req.params.id);
        const updatedUser = await User.findOne(query).select('-password');

        if (!updatedUser) {
            res.status(404).json({ message: "Utilizador não existe" });
        } else if (updatedUser.estado === 'Inativo') {
            res.status(400).json({ message: "Utilizador já está suspenso" });
        } else {
            await User.findOneAndUpdate(query, { estado: 'Inativo' }, { new: true });
            return res.status(200).json({message: "Utilizador suspenso com sucesso"});
        } 
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unsuspendUser = async (req, res) => {
    if (req.loggedUserRole !== 'Admin') {
        return res.status(403).json({ message: 'Não tem permissões para ativar este utilizador.' });
    }
    try {
        const query = resolveUserQuery(req.params.id);
        const updatedUser = await User.findOne(query).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilizador não existe" });
        } else if (updatedUser.estado === 'Ativo') {
            return res.status(400).json({ message: "Utilizador já está ativo" });
        } else {
            await User.findOneAndUpdate(query, { estado: 'Ativo' }, { new: true });
            return res.status(200).json({ message: "Utilizador ativado com sucesso" });
        }
        return res.json({ message: "Utilizador ativado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updatePartialUser = async (req, res) => {
    try {
        if (req.params.id!==req.loggedUserId) {
            return res.status(403).json({ message: 'Só pode alterar a sua própria conta.' });
        }

        const updateData = { ...req.body, updated_at: Date.now() };

        const query = resolveUserQuery(req.params.id);
        const updatedUser = await User.findOneAndUpdate(
            query,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilizador não existe" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: 'Não tem permissões para eliminar este utilizador.' });
        }
        const query = resolveUserQuery(req.params.id);
        const deletedUser = await User.findOneAndDelete(query);
        if (!deletedUser) {
            return res.status(404).json({ message: "Utilizador não existe" });
        }
        return res.status(204).json({ message: "Utilizador eliminado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByField,
    createUser,
    updateUser,
    updatePartialUser,
    deleteUser,
    suspendUser,
    unsuspendUser
};