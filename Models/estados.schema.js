const mongoose = require('mongoose');

const estadosSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
  
});

module.exports = mongoose.model('Estado', estadosSchema, 'Estados');
