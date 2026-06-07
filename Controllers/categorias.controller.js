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

const createCategoria = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Utilizador') {
            return res.status(403).json({ message: "Apenas utilizadores podem criar categorias" });
        }

        const lastCategoria = await Categoria.findOne().sort({ id: -1 });
        const nextId = (lastCategoria?.id || 0) + 1;

        const {titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao} = req.body;
        if (!titulo || !descricao || !categoria_id || !user_id || !estado_id || !prioridade || !edificio || !zona || !latitude || !longitude) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        }
        const newCategoria = new Categoria({ id: nextId, titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao });
        await newCategoria.save();
        return res.status(201).json(newCategoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategoria = async (req, res) => {
    try { 
        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({ message: "Apenas funcionários podem atualizar categorias" });
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