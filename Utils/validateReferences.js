const mongoose = require('mongoose');
const Categoria = require('../Models/categorias.schema');
const User = require('../Models/users.schema');
const Estado = require('../Models/estados.schema');
const {
    validateObjectId,
    checkExists
} = require('../Utils/validateReferences');


const validateObjectId = (id, name) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return `${name} não é um ObjectId válido`;
    }
    return null;
};

const checkExists = async (Model, id, name) => {
    const exists = await Model.findById(id);
    if (!exists) {
        return `${name} não existe na base de dados`;
    }
    return null;
};

module.exports = {
    validateObjectId,
    checkExists
};