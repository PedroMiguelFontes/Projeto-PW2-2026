const mongoose = require('mongoose');

const categoriasSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
        unique: true
    },
    descricao: {
        type: String,
        maxlength: 30,
    }
});

module.exports = mongoose.model('Categoria', categoriasSchema, 'Categorias');
