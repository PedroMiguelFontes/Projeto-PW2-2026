const mongoose = require('mongoose')
const OccurrenceHistory = require('../Models/historico.model');

const addHistory = async ({ ocorrenciaId, userId, campo, oldValue, newValue }) => {
    await OccurrenceHistory.create({
        ocorrencia: ocorrenciaId,
        alteradoPor: userId,
        campo,
        valorAntigo: oldValue,
        valorNovo: newValue
    });
};

module.exports={
    addHistory
}