const mongoose = require('mongoose');
const Ocorrencia = require('./ocorrencias.schema');
const User = require('./users.schema');

const tratamentoSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    ocorrencia_id: {
        type: Number,
        required: true
    },
    funcionario_id: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: true,
        maxlength: 500
    },
    data_prevista: {
        type: Date,
        required: true
    },
    data_real: {
        type: Date
    }
});

module.exports = mongoose.model('Tratamento', tratamentoSchema, 'Tratamentos');
