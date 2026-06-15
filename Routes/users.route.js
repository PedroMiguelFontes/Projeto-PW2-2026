const express = require('express');
const { getAllUsers, getUserById, createUser, updateUser, updatePartialUser, suspendUser, unsuspendUser, deleteUser, getUserByField, validateFuncionario } = require('../Controllers/users.controller.js');
const { verifyToken } = require('../Controllers/auth.controller.js');

const router = express.Router();
router.get('/', getAllUsers);
router.get('/search', getUserByField);
router.post('/', createUser);
router.patch('/:id/suspend', verifyToken, suspendUser);
router.patch('/:id/unsuspend', verifyToken, unsuspendUser);
router.patch('/:id/validate',verifyToken,validateFuncionario)
router.get('/:id', getUserById);
router.put('/:id', verifyToken, updateUser);
router.patch('/:id', verifyToken, updatePartialUser);
router.delete('/:id', verifyToken, deleteUser);
module.exports = router;