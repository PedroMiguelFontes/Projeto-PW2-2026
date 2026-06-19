const Historico = require('../Models/historico.model');

const createHistory = async ({
    ocorrenciaId,
    userId,
    campo,
    oldValue,
    newValue
}) => {
    await Historico.create({
        ocorrencia: ocorrenciaId,
        alteradoPor: userId,
        campo,
        valorAntigo: oldValue,
        valorNovo: newValue
    });
};

module.exports = { createHistory };