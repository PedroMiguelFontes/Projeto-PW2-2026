const mongoose = require('mongoose');
const Estatistica = require('../Models/estatisticas.schema');
const bcrypt = require('bcryptjs');
const verifyToken = require('./auth.controller').verifyToken;

const getEstatisticas = async (req, res) => {
    try {
        if (req.loggedUserRole !== 'Admin') {
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }
        
        const Ocorrencia = require('../Models/ocorrencias.model');

        const ocorrencia = await Ocorrencia.findOne().lean();
        console.log(ocorrencia);


        const totalOcorrencias = await Ocorrencia.countDocuments();

        const porEstado = await Ocorrencia.aggregate([
            {
                $lookup: {
                    from: 'Estados',
                    localField: 'estado_id',
                    foreignField: 'id',
                    as: 'estado'
                }
            },
            {
                $unwind: '$estado'
            },
            {
                $group: {
                    _id: '$estado.nome',
                    total: { $sum: 1 }
                }
            }
        ]);

        const estatisticas = {
            totalOcorrencias,
            porEstado: {}
        };

        porEstado.forEach(item => {
            estatisticas.porEstado[item._id] = item.total;
        });

        return res.status(200).json(estatisticas);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateEstatisticas = async (req,res) => {
 
    if (req.loggedUserRole !== 'Admin') {
        return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    const { totalOcorrencias, porEstado } = req.body;
    if (totalOcorrencias !== undefined) {
        estatisticas.totalOcorrencias = totalOcorrencias;
    } else if (porEstado !== undefined) {
        estatisticas.porEstado = porEstado;
    }
    res.status(200).json(estatisticas);
}

const updatePartialEstatisticas = async (req,res) => {
    if (req.loggedUserRole !== 'Admin') {
        return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    const { totalOcorrencias, porEstado } = req.body;
    if (totalOcorrencias !== undefined) {
        estatisticas.totalOcorrencias = totalOcorrencias;
    } else if (porEstado !== undefined) {
        estatisticas.porEstado = porEstado;
    }
    res.status(200).json(estatisticas);
}

module.exports = {
    getEstatisticas,
    updateEstatisticas,
    updatePartialEstatisticas
}