const express = require('express');
const router = express.Router();
const verifyToken = require('../Controllers/auth.controller');
const { getAllTratamentos, searchTratamentos, getTratamentoById, createTratamento, updateTratamento, updatePartialTratamento, deleteTratamento } = require('../Controllers/tratamentos.controller');

router.get('/', getAllTratamentos);
router.get('/search', searchTratamentos);
router.post('/', verifyToken, createTratamento);
router.get('/:id', getTratamentoById);
router.put('/:id', verifyToken, updateTratamento);
router.patch('/:id', verifyToken, updatePartialTratamento);
router.delete('/:id', verifyToken, deleteTratamento);


module.exports = router;
