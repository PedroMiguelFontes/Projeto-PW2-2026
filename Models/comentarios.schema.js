const mongoose = require('mongoose');

const comentariosSchema = new mongoose.Schema({
    ocorrencia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ocorrencia',
        required: true
    },
     user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['Visivel', 'Indevido'],
        default: 'Visivel'
    }
});

module.exports = mongoose.model('Comentario', comentariosSchema, 'Comentarios');
