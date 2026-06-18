const mongoose = require('mongoose');

const tratamentoSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },

    ocorrencia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ocorrencia',
        required: true
    },

    funcionario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    descricao: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },

    data_prevista: {
        type: Date,
        required: true
    },

    data_real: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    'Tratamento',
    tratamentoSchema,
    'Tratamentos'
);