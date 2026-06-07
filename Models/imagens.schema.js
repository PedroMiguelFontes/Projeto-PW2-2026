const mongoose = require('mongoose');

const imagemSchema = new mongoose.Schema({
    
    id: {
        type: Number,
        unique: true,
    },
    ocorrenciaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ocorrencia',
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Imagem', imagemSchema, 'Imagens');
