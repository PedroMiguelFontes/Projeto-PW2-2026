const express = require('express');
const router = express.Router({ mergeParams: true }); 
const {getComentariosByOcorrencia,createComentario,updateComentario,deleteComentario,sinalizarComentario}= require('../Controllers/comentarios.controller')
const verifyToken = require('../Controllers/auth.controller').verifyToken;

router.get('/', getComentariosByOcorrencia);
router.post('/', verifyToken, createComentario);
router.delete('/:comentarioId', verifyToken, deleteComentario);
router.put('/:comentarioId', verifyToken, updateComentario);
router.patch('/:comentarioId/sinalizar', verifyToken, sinalizarComentario)

module.exports = router;
