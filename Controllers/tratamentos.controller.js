const mongoose = require('mongoose');
const Tratamento = require('../Models/tratamentos.schema');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;
const isValidDateFormat = require('../Utils/dateValidation');


const resolveTratamentoQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};

const getAllTratamentos = async (req, res) => {
    try {
        const tratamentos = await Tratamento.find()
        .populate('ocorrencia_id', 'id titulo')
        .populate('funcionario_id', 'id nome email');
        return res.status(200).json(tratamentos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchTratamentos = async (req, res) => {
    try {
        const { field, value } = req.query;
        const query = {};
        query[field] = value;
        const tratamentos = await Tratamento.find(query)
        .populate('ocorrencia_id', 'id titulo')
        .populate('funcionario_id', 'id nome email');;
        if (!tratamentos || tratamentos.length === 0) {
            return res.status(404).json({ message: "Tratamento não encontrado" });
        }
        return res.status(200).json(tratamentos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTratamentoById = async (req, res) => {
    try {
        const query = resolveTratamentoQuery(req.params.id);
        const tratamento = await Tratamento.findOne(query);
        if (!tratamento) {
            return res.status(404).json({ message: "Tratamento não encontrado" });
        }
        return res.status(200).json(tratamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTratamento = async (req, res) => {
    try {
        if (!req.loggedUserId) {
            return res.status(401).json({ message: "Autenticação necessária" });
        }
        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({ message: "Apenas funcionários podem criar tratamentos" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes criar tratamentos"})
        }

        const { ocorrencia_id, descricao, data_prevista, data_real } = req.body;
        console.log(isValidDateFormat);
        console.log('BODY RECEBIDO:', req.body);
        if (!ocorrencia_id || !descricao || !data_prevista || !data_real) {
            return res.status(400).json({message: 'Todos os campos obrigatórios devem ser preenchidos'});
        }

        if (!isValidDateFormat(data_prevista)) {
            return res.status(400).json({message: 'data_prevista deve estar no formato AAAA-MM-DD'});
        }

        if (data_real && !isValidDateFormat(data_real)) {
            return res.status(400).json({message: 'data_real deve estar no formato AAAA-MM-DD'});
        }

        const lastTratamento = await Tratamento.findOne().sort({ id: -1 });
        const nextId = (lastTratamento?.id || 0) + 1;
        const newTratamento = new Tratamento({
        id: nextId,
        ocorrencia_id,
        funcionario_id: req.loggedUserId,
        descricao,
        data_prevista,
        data_real
        });
        await newTratamento.save();
        return res.status(201).json(newTratamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTratamento = async (req, res) => {
    try {
        if (!req.loggedUserId) {
            return res.status(401).json({
                message: "Autenticação necessária"
            });
        }

        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({
                message: "Apenas funcionários podem atualizar tratamentos"
            });
        }

        if (req.loggedUserEstado !== 'Ativo') {
            return res.status(403).json({
                message: "Estás suspenso e não podes atualizar tratamentos"
            });
        }

        const query = resolveTratamentoQuery(req.params.id);

        const {
            ocorrencia_id,
            descricao,
            data_prevista,
            data_real
        } = req.body;

        const tratamento = await Tratamento.findOne(query);

        if (!tratamento) {
            return res.status(404).json({
                message: "Tratamento não encontrado"
            });
        }

        if (!ocorrencia_id||!descricao||!data_prevista||!data_real) {
            return res.status(400).json({message:'Por favor preencha todos os campos necessários'})
        }

        
        tratamento.ocorrencia_id = ocorrencia_id;
        tratamento.descricao = descricao;
        tratamento.data_prevista = data_prevista;
        tratamento.data_real = data_real;

        await tratamento.save();

        return res.status(200).json(tratamento);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const updatePartialTratamento = async (req, res) => {
    try {
        if (!req.loggedUserId) {
            return res.status(401).json({ message: "Autenticação necessária" });
        }
        if (req.loggedUserRole !== 'Funcionario') {
            return res.status(403).json({ message: "Apenas funcionários podem atualizar tratamentos" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes atualizar tratamentos"})
        } 
        const query = resolveTratamentoQuery(req.params.id);
        const tratamento = await Tratamento.findOne(query);
        if (!tratamento) {
            return res.status(404).json({ message: "Tratamento não encontrado" });
        }
        const { ocorrencia_id, descricao, data_prevista, data_real } = req.body;
        if (ocorrencia_id !== undefined) tratamento.ocorrencia_id = ocorrencia_id;
        if (descricao !== undefined) tratamento.descricao = descricao;
        if (data_prevista !== undefined) tratamento.data_prevista = data_prevista;
        if (data_real !== undefined) tratamento.data_real = data_real;
        
        if (data_prevista !== undefined && !isValidDateFormat(data_prevista)) {
            return res.status(400).json({message: 'data_prevista deve estar no formato AAAA-MM-DD'});
        }

        if (data_real !== undefined &&!isValidDateFormat(data_real)) {
            return res.status(400).json({message: 'data_real deve estar no formato AAAA-MM-DD'});
        }

        await tratamento.save();
        return res.status(200).json(tratamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTratamento = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ message: "Apenas admins podem apagar tratamentos" });
        }
        if (req.loggedUserEstado !=='Ativo') {
            return res.status(403).json({message:"Estás suspenso e não podes apagar tratamentos"})
        }

        const query = resolveTratamentoQuery(req.params.id);
        const tratamento = await Tratamento.findOneAndDelete(query);
        if (!tratamento) {
            return res.status(404).json({ message: "Tratamento não encontrado" });
        }
        return res.status(200).json({ message: "Tratamento apagado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTratamentos,
    searchTratamentos,
    getTratamentoById,
    createTratamento,
    updateTratamento,
    updatePartialTratamento,
    deleteTratamento
};
