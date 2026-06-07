const mongoose = require('mongoose');

const comentariosSchema = new mongoose.Schema({
    ocorrencia_id: {
        type: Number,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    data_comentario: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['Visivel', 'Indevido'],
        default: 'Visivel'
    }
});

module.exports = mongoose.model('Comentario', comentariosSchema, 'Comentarios');
