const mongoose = require('mongoose');

const estatisticasSchema = new mongoose.Schema({
    totalOcorrencias: {
        type: Number,
        default: 0
    },
    porEstado: {
        aberta: {
            type: Number,
            default: 0
        },      
        em_progresso: {
            type: Number,
            default: 0
        },
        fechada: {
            type: Number,
            default: 0
        }
    },
});

module.exports = mongoose.model('Estatistica', estatisticasSchema, 'Estatisticas');
