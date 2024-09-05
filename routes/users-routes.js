const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser ,loginUser } = require('../controllers/users-controller');

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/users', getUsers);

router.patch('/users', updateUser);

router.delete('/users', deleteUser);

module.exports = router;
