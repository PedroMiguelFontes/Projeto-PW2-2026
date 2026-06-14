const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },

    nome: {
        type: String,
        required: true,
        maxlength: 100,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxlength: 15,
        match: [
            /^\S+@\S+\.\S+$/,
            'Email inválido'
        ]
    },
    password: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: { 
            values: ['Funcionario', 'Utilizador', 'Admin'],
            message: '{VALUE} is not suported'
        }
    },
    estado: {
        type: String,
        enum: ['Ativo', 'Inativo'],
        default: 'Ativo'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema, 'Users');
