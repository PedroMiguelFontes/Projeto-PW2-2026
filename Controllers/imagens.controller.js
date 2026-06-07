const mongoose = require('mongoose');
const Imagem = require('../Models/imagens.schema.js');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

const resolveImgQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};


const getAllImagens = async (req, res) => {
    try {
        const imagens = await Imagem.find();
        return res.status(200).json(imagens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createImagem = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Utilizador') {
            return res.status(403).json({ message: "Apenas utilizadores podem criar imagens" });
        }

        const lastImagem = await Imagem.findOne().sort({ id: -1 });
        const nextId = (lastImagem?.id || 0) + 1;

        const {titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao} = req.body;
        if (!titulo || !descricao || !categoria_id || !user_id || !estado_id || !prioridade || !edificio || !zona || !latitude || !longitude) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
        }
        const newImagem = new Imagem({ id: nextId, titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao });
        await newImagem.save();
        return res.status(201).json(newImagem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateImagem = async (req, res) => {
    try { 
        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({ message: "Apenas funcionários podem atualizar imagens" });
        }
        const query = resolveImgQuery(req.params.id);
        const { ocorrencia_id,url } = req.body;
        const imagem = await Imagem.findOneAndUpdate(query, req.body, { new: true });
        if (!imagem) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }
        Object.assign(imagem, { ocorrencia_id, url });
        await imagem.save();
        return res.status(200).json(imagem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteImagem = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem apagar imagens" });
        }
        const query = resolveImgQuery(req.params.id);
        const imagem = await Imagem.findOneAndDelete(query);
        if (!imagem) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }
        return res.status(204).json({ message: "Imagem apagada com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllImagens,
    createImagem,
    updateImagem,
    deleteImagem
};