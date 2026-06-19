const mongoose = require('mongoose');
const Ocorrencia = require('../Models/ocorrencias.model');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;
const isValidDateFormat = require('../Utils/dateValidation');
const { createHistory } = require('../utils/history');

const canEditOcorrencia = (req, ocorrencia) => {

    if (req.loggedUserEstado !== 'Ativo') {
        return {
            allowed: false,
            message: 'Estás suspenso/não valido e não podes atualizar ocorrências'
        };
    }

    
    if (req.loggedUserRole === 'Admin') {
        return { allowed: false };
    }

    if (req.loggedUserRole === 'Funcionario') {
        return { allowed: true };
    }

    if (req.loggedUserRole === 'Utilizador') {
        if (ocorrencia.user_id.equals(req.loggedUserId)) {
            return { allowed: true };
        }

        return {
            allowed: false,
            message: 'Só podes editar ocorrências criadas por ti'
        };
    }

    return {
        allowed: false,
        message: 'Sem permissões'
    };
};


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
        const ocorrencias = await Ocorrencia.find() 
        .populate('categoria_id')
        .populate('estado_id')
        .populate('user_id');
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
            return res.status(403).json({
                message: "Apenas utilizadores podem criar ocorrências"
            });
        }

        if (req.loggedUserEstado !== 'Ativo') {
            return res.status(403).json({
                message: "Estás suspenso e não podes criar ocorrências"
            });
        }

        const lastOcorrencia = await Ocorrencia.findOne().sort({ id: -1 });
        const nextId = (lastOcorrencia?.id || 0) + 1;

        const {
            titulo,
            descricao,
            categoria_id,
            estado_id,
            prioridade,
            edificio,
            zona,
            latitude,
            longitude
        } = req.body;

        if (
            !titulo || !descricao || !categoria_id ||
            !estado_id || !prioridade ||
            !edificio || !zona ||
            latitude == null || longitude == null
        ) {
            return res.status(400).json({
                message: "Todos os campos obrigatórios devem ser preenchidos"
            });
        }

        const newOcorrencia = new Ocorrencia({
            id: nextId,
            titulo,
            descricao,
            categoria_id,
            estado_id,
            prioridade,
            edificio,
            zona,
            latitude,
            longitude,
            user_id: req.loggedUserId,

            data_registo: new Date(),
            data_resolucao: new Date()
        });

        await newOcorrencia.save();

        await createHistory({
            ocorrenciaId: ocorrencia._id,
            userId: req.loggedUserId,
            campo: "CREATE",
            oldValue: null,
            newValue: ocorrencia
        });

        return res.status(201).json(newOcorrencia);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
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
        const oldOcorrencia = await Ocorrencia.findOne(query);
        const { titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao } = req.body;
        const ocorrencia = await Ocorrencia.findOne(query);
        const beforeUpdate = oldOcorrencia.toObject();
        if (!ocorrencia) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }
        const permission = canEditOcorrencia(req, ocorrencia);

        if (!permission.allowed) {
            return res.status(403).json({
                message: permission.message
            });
        }
        Object.assign(oldOcorrencia, {titulo,
        descricao,
        categoria_id,
        user_id,
        estado_id,
        prioridade,
        edificio,
        zona,
        latitude,
        longitude,
        data_registo,
        data_resolucao
    });

        const campos = [
    'titulo',
    'descricao',
    'categoria_id',
    'user_id',
    'estado_id',
    'prioridade',
    'edificio',
    'zona',
    'latitude',
    'longitude',
    'data_registo',
    'data_resolucao'
    ];

    for (const campo of campos) {
        const oldValue = beforeUpdate[campo];
        const newValue = oldOcorrencia[campo];

    
    if (String(oldValue) !== String(newValue)) {
        await Historico.create({
            ocorrencia: oldOcorrencia._id,
            alteradoPor: req.loggedUserId,
            campo,
            valorAntigo: oldValue,
            valorNovo: newValue
        });
    }
}

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
            return res.status(403).json({message:"Estás suspenso/não válido e não podes atualizar ocorrencias"})
        }
        const query = resolveOcorrenciaQuery(req.params.id);
        const ocorrencia = await Ocorrencia.findOne(query);
        if (!ocorrencia) {
            return res.status(404).json({ message: "Ocorrência não encontrada" });
        }

        const permission = canEditOcorrencia(req, ocorrencia);

        if (!permission.allowed) {
            return res.status(403).json({
                message: permission.message
            });
        }
        const { titulo, descricao, categoria_id, user_id, estado_id, prioridade, edificio, zona, latitude, longitude, data_registo, data_resolucao } = req.body;
        if (titulo !== undefined) ocorrencia.titulo = titulo;
        if (descricao !== undefined) ocorrencia.descricao = descricao;
        if (categoria_id !== undefined) ocorrencia.categoria_id = categoria_id;
        if (estado_id !== undefined) ocorrencia.estado_id = estado_id;
        if (prioridade !== undefined) ocorrencia.prioridade = prioridade;
        if (edificio !== undefined) ocorrencia.edificio = edificio;
        if (zona !== undefined) ocorrencia.zona = zona;
        if (latitude !== undefined) ocorrencia.latitude = latitude;
        if (longitude !== undefined) ocorrencia.longitude = longitude;
        if (data_registo !== undefined) ocorrencia.data_registo = data_registo;
        if (data_resolucao !== undefined) ocorrencia.data_resolucao = data_resolucao;

        const fields = req.body;

    for (const key in fields) {
        if (ocorrencia[key] !== undefined && ocorrencia[key] !== fields[key]) {

            await createHistory({
                ocorrenciaId: ocorrencia._id,
                userId: req.loggedUserId,
                campo: key,
                oldValue: ocorrencia[key],
                newValue: fields[key]
            });

            ocorrencia[key] = fields[key];
        }
    }

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

        if (req.loggedUserRole == 'Utilizador' && !ocorrencia.user_id.equals(req.loggedUserId)) {
            return res.status(403).json({ message: "Apenas podes apagar ocorrencias que você criou" });
        }

        await createHistory({
            ocorrenciaId: ocorrencia._id,
            userId: req.loggedUserId,
            campo: "DELETE",
            oldValue: ocorrencia,
            newValue: null
        });

        await ocorrencia.deleteOne(query)
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