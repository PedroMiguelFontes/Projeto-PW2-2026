const express = require('express');
const router = express.Router();
const { getAllImagens, createImagem, updateImagem, deleteImagem } = require('../Controllers/imagens.controller.js');

router.get('/', getAllImagens);
router.post('/', createImagem);
router.put('/:id', updateImagem);
router.delete('/:id', deleteImagem);

module.exports = router;
