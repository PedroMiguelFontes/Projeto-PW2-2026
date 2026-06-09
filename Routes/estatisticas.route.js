const express = require('express');
const router = express.Router();
const verifyToken = require('../Controllers/auth.controller').verifyToken;
const {getEstatisticas, updateEstatisticas, updatePartialEstatisticas} = require('../Controllers/estatisticas.controller.js');

router.get('/', verifyToken, getEstatisticas);
router.put('/', verifyToken, updateEstatisticas);
router.patch('/', verifyToken, updatePartialEstatisticas);



module.exports = router;