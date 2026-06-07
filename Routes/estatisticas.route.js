const express = require('express');
const router = express.Router();
const {getEstatisticas, updateEstatisticas, updatePartialEstatisticas} = require('../Controllers/estatisticas.controller.js');

router.get('/', getEstatisticas);
router.put('/', updateEstatisticas);
router.patch('/', updatePartialEstatisticas);



module.exports = router;