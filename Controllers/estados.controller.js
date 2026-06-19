const mongoose = require('mongoose');
const Estado = require('../Models/estados.schema');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

const resolveEstadoQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};


const getAllEstados = async (req, res) => {
    try {
        const estados = await Estado.find();
        return res.status(200).json(estados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEstado = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem criar estados" });
        }

        const lastEstado = await Estado.findOne().sort({ id: -1 });
        const nextId = (lastEstado?.id || 0) + 1;

        const {titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao} = req.body;
        if (!titulo || !descricao || !categoria_id || !user_id || !estado_id || !prioridade || !edificio || !zona || !latitude || !longitude) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        }
        const newEstado = new Estado({ id: nextId, titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao });
        await newEstado.save();
        return res.status(201).json(newEstado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEstado = async (req, res) => {
    try { 
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem atualizar estados" });
        }
        const query = resolveEstadoQuery(req.params.id);
        const { ocorrencia_id,url } = req.body;
        const estado = await Estado.findOneAndUpdate(query, req.body, { new: true });
        if (!estado) {
            return res.status(404).json({ message: "Estado não encontrado" });
        }
        Object.assign(estado, { ocorrencia_id, url });
        await estado.save();
        return res.status(200).json(estado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEstado = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem apagar estados" });
        }
        const query = resolveEstadoQuery(req.params.id);
        const estado = await Estado.findOneAndDelete(query);
        if (!estado) {
            return res.status(404).json({ message: "Estado não encontrado" });
        }
        return res.status(204).json({ message: "Estado apagado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEstados,
    createEstado,
    updateEstado,
    deleteEstado
};

