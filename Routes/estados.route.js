const express = require('express');
const router = express.Router();
const { getAllEstados, createEstado, updateEstado, deleteEstado } = require('../Controllers/estados.controller.js');

router.get('/', getAllEstados);
router.post('/', createEstado);
router.put('/:id', updateEstado);
router.delete('/:id', deleteEstado);

module.exports = router;
