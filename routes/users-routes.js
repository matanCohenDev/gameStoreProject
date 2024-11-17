const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser ,loginUser ,logout,currentUser, addProductsToUser, deleteProductFromUser} = require('../controllers/users-controller');

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/getUsers', getUsers);

router.get('/getCurrentUser', currentUser);

router.patch('/updateUser', updateUser);

router.delete('/deleteUser', deleteUser);

router.post('/logout', logout);

router.post('/addProducts', addProductsToUser);

router.post('/deleteProductFromUser', deleteProductFromUser);

module.exports = router;