const express = require('express');
const router = express.Router({ mergeParams: true }); 
const comentariosController = require('../Controllers/comentarios.controller');

router.get('/', comentariosController.getComentariosByOcorrencia);
router.post('/', comentariosController.createComentario);
router.delete('/:comentarioId', comentariosController.deleteComentario);
router.patch('/:comentarioId/estado', comentariosController.updateEstadoComentario);

module.exports = router;
