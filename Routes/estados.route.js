const express = require('express');
const router = express.Router();
const verifyToken = require('../Controllers/auth.controller').verifyToken;
const { getAllEstados, createEstado, updateEstado, deleteEstado } = require('../Controllers/estados.controller.js');

router.get('/', getAllEstados);
router.post('/', verifyToken, createEstado);
router.put('/:id',verifyToken, updateEstado);
router.delete('/:id', verifyToken, deleteEstado);

module.exports = router;
