const mongoose = require('mongoose');
const Categoria = require('../Models/categorias.schema');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

const resolveCategoriaQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};


const getAllCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        return res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOcorrencia = async (req, res) => {
    try {

        const {
            
        } = req.body;

        const validations = [
            validateObjectId(categoria_id, 'categoria_id'),
            validateObjectId(user_id, 'user_id'),
            validateObjectId(estado_id, 'estado_id')
        ].filter(Boolean);

        if (validations.length > 0) {
            return res.status(400).json({ errors: validations });
        }

        const checks = await Promise.all([
            checkExists(Categoria, categoria_id, 'Categoria'),
            checkExists(User, user_id, 'User'),
            checkExists(Estado, estado_id, 'Estado')
        ]);

        const errors = checks.filter(Boolean);

        if (errors.length > 0) {
            return res.status(404).json({ errors });
        }

        const ocorrencia = new Ocorrencia({
            titulo,
            descricao,
            categoria_id,
            user_id,
            estado_id,
            prioridade,
            edificio,
            zona,
            latitude,
            longitude
        });

        await ocorrencia.save();

        return res.status(201).json(ocorrencia);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateCategoria = async (req, res) => {
    try { 
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem atualizar categorias" });
        }
        const query = resolveCategoriaQuery(req.params.id);
        const { ocorrencia_id,url } = req.body;
        const categoria = await Categoria.findOneAndUpdate(query, req.body, { new: true });
        if (!categoria) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }
        Object.assign(categoria, { ocorrencia_id, url });
        await categoria.save();
        return res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem apagar categorias" });
        }
        const query = resolveCategoriaQuery(req.params.id);
        const categoria = await Categoria.findOneAndDelete(query);
        if (!categoria) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }
        return res.status(204).json({ message: "Categoria apagada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
};