const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser ,loginUser } = require('../controllers/users-controller');

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/getUsers', getUsers);

router.patch('/updateUser', updateUser);

router.delete('/deleteUser', deleteUser);

module.exports = router;
