const express = require('express');
const router = express.Router();
const verifyToken = require('../Controllers/auth.controller').verifyToken;
const { getAllImagens, createImagem, updateImagem, deleteImagem } = require('../Controllers/imagens.controller.js');


router.get('/', getAllImagens);
router.post('/', verifyToken, createImagem);
router.put('/:id', verifyToken, updateImagem);
router.delete('/:id', verifyToken, deleteImagem);

module.exports = router;
