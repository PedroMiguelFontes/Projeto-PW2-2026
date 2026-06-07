const express = require('express');
const router = express.Router();
const verifyToken = require('../Controllers/auth.controller').verifyToken;
const { getAllOcorrencias, searchOcorrencias, getOcorrenciaById, createOcorrencia, updateOcorrencia, updatePartialOcorrencia, deleteOcorrencia } = require('../Controllers/ocorrencias.controller');

router.get('/', getAllOcorrencias);
router.get('/search', searchOcorrencias);
router.post('/', verifyToken, createOcorrencia);
router.get('/:id', getOcorrenciaById);
router.put('/:id', verifyToken, updateOcorrencia);
router.patch('/:id', verifyToken, updatePartialOcorrencia);
router.delete('/:id', verifyToken, deleteOcorrencia);

module.exports = router;
