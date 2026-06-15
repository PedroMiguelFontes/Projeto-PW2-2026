const express=require('express')
const router=express.Router()
const { addHistory} = require('../Controllers/historico.controller') 

router.post('/',addHistory)

module.exports = router