const express = require('express');
const router = express.Router();
const {getAllCategorias,createCategoria,updateCategoria,deleteCategoria } = require('../Controllers/categorias.controller.js');
const verifyToken = require('../Controllers/auth.controller').verifyToken;

router.get('/', getAllCategorias);
router.post('/', verifyToken,createCategoria);
router.put('/:id', verifyToken,updateCategoria);
router.delete('/:id', verifyToken,deleteCategoria);

module.exports = router;
