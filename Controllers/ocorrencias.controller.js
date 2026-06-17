const mongoose = require('mongoose');
const Ocorrencia = require('../Models/ocorrencias.model');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

const resolveOcorrenciaQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};


const getAllOcorrencias = async (req, res) => {
    try {
        const ocorrencias = await Ocorrencia.find();
        return res.status(200).json(ocorrencias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchOcorrencias = async (req, res) => {
    try {
        const { field, value } = req.query;
        const query = {};
        query[field] = value;
        const ocorrencias = await Ocorrencia.find(query);
        if (!ocorrencias || ocorrencias.length === 0) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }
        return res.status(200).json(ocorrencias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOcorrenciaById = async (req, res) => {
    try {
        const query = resolveOcorrenciaQuery(req.params.id);
        const ocorrencia = await Ocorrencia.findOne(query);
        if (!ocorrencia) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }
        return res.status(200).json(ocorrencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOcorrencia = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Utilizador') {
            return res.status(403).json({ message: "Apenas utilizadores podem criar ocorrências" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes criar ocorrencias"})
        }

        const lastOcorrencia = await Ocorrencia.findOne().sort({ id: -1 });
        const nextId = (lastOcorrencia?.id || 0) + 1;

        const {titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao} = req.body;
        if (!titulo || !descricao || !categoria_id || !user_id || !estado_id || !prioridade || !edificio || !zona || !latitude || !longitude) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        }



        const newOcorrencia = new Ocorrencia({ id: nextId, titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao });
        await newOcorrencia.save();
        return res.status(201).json(newOcorrencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOcorrencia = async (req, res) => {
    try { 
        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({ message: "Apenas funcionários podem atualizar ocorrências" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes atualizar ocorrencias"})
        }
        const query = resolveOcorrenciaQuery(req.params.id);
        const { titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao } = req.body;
        const ocorrencia = await Ocorrencia.findOne(query);
        if (!ocorrencia) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }
        Object.assign(ocorrencia, { titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao });
        await ocorrencia.save();
        return res.status(200).json(ocorrencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePartialOcorrencia = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({ message: "Apenas funcionários podem atualizar ocorrencias" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes atualizar ocorrencias"})
        }
        const query = resolveOcorrenciaQuery(req.params.id);
        const ocorrencia = await Ocorrencia.findOne(query);
        if (!ocorrencia) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }
        const { titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao } = req.body;
        if (titulo !== undefined) ocorrencia.titulo = titulo;
        if (descricao !== undefined) ocorrencia.descricao = descricao;
        if (categoria_id !== undefined) ocorrencia.categoria_id = categoria_id;
        if (user_id !== undefined) ocorrencia.user_id = user_id;
        if (estado_id !== undefined) ocorrencia.estado_id = estado_id;
        if (prioridade !== undefined) ocorrencia.prioridade = prioridade;
        if (edificio !== undefined) ocorrencia.edificio = edificio;
        if (zona !== undefined) ocorrencia.zona = zona;
        if (latitude !== undefined) ocorrencia.latitude = latitude;
        if (longitude !== undefined) ocorrencia.longitude = longitude;
        if (data_registo !== undefined) ocorrencia.data_registo = data_registo;
        if (data_resolucao !== undefined) ocorrencia.data_resolucao = data_resolucao;
        await ocorrencia.save();
        return res.status(200).json(ocorrencia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOcorrencia = async (req, res) => {
    try {
        
        if (req.loggedUserRole == 'Funcionario') {
            return res.status(403).json({ message: "Apenas utilizadores ou administradores podem apagar ocorrencias" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes apagar ocorrencias"})
        }
        
        const query = resolveOcorrenciaQuery(req.params.id);
        const ocorrencia = await Ocorrencia.findOne(query);
        if (!ocorrencia) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }

        //console.log("USER LOGADO:", req.loggedUserId, typeof req.loggedUserId);
        //console.log("OCORRENCIA USER:", ocorrencia.user_id, typeof ocorrencia.user_id);

        console.log("OCORRENCIA COMPLETA:", ocorrencia);

        if (req.loggedUserRole == 'Utilizador' && req.loggedUserId !== ocorrencia.user_id) {
            return res.status(403).json({ message: "Apenas podes apagar ocorrencias que você criou" });
        }
        await ocorrencia.delete()
        return res.status(200).json({ message: "Ocorrência apagada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOcorrencias,
    searchOcorrencias,
    getOcorrenciaById,
    createOcorrencia,
    updateOcorrencia,
    updatePartialOcorrencia,
    deleteOcorrencia
};