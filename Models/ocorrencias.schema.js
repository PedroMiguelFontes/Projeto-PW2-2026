const mongoose = require('mongoose');

const ocorrenciasSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    titulo: {
        type: String,
        required: true,
        maxlength: 100
    },
    descricao: {
        type: String,
        required: true,
        maxlength: 200
    },
    categoria_id: {
        type:Number,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    estado_id: {
        type: Number,
        required: true
    },
    prioridade: {
        type: String,
        enum: ['baixa', 'media', 'alta'],
        required: true
    },
    edificio: {
        type: String,
        required: true,
        maxlength: 100
    },
    zona: {
        type: String,
        required: true,
        maxlength: 100
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    data_registro: {
        type: Date,
        default: Date.now
    },
    data_resolucao: {
        type: Date
    }
});

module.exports = ocorrenciasSchema;
