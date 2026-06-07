const mongoose = require('mongoose');
import Estatistica from '../Models/estatisticas.schema.js';
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

export const getEstatisticas = async (req, res) => {
    if (req.LoggedUserRole!='Admin') {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }
    res.status(200).json(estatisticas);
};

export const updateEstatisticas = async (req,res) => {
    if (req.LoggedUserRole!='Admin') {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }
    const { totalOcorrencias, porEstado } = req.body;
    if (totalOcorrencias !== undefined) {
        estatisticas.totalOcorrencias = totalOcorrencias;
    } else if (porEstado !== undefined) {
        estatisticas.porEstado = porEstado;
    }
    res.status(200).json(estatisticas);
}

