const mongoose = require('mongoose');

const historicoSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    ocorrencia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ocorrencia',
        required: true
    },
    estado_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estado',
        required: true
    },
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data_alteracao: {
        type: Date,
        default: Date.now,
        required: true
    },
    descricao: {
        type: String,
        required: true,
        maxlength: 500
    }
});

module.exports = mongoose.model('Historico', historicoSchema, 'Historicos');
