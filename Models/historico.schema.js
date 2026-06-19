const mongoose = require('mongoose');

const occurrenciaHistorySchema = new mongoose.Schema({
    ocorrencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Occorrencia',
        required: true
    },

    alteradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    campo: {
        type: String,
        required: true
    },

    valorAntigo: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    valorNovo: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    dataAlteracao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Historico', occurrenciaHistorySchema, 'Historico');