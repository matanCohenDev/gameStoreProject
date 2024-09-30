const express = require('express');
const router = express.Router();
const { createMessage, getMessages, updateMessage, deleteMessage } = require('../controllers/messages-controller');

router.post('/createMessage', createMessage);

router.get('/getMessages', getMessages);

router.patch('/updateMessage', updateMessage);

router.delete('/deleteMessage', deleteMessage);

module.exports = router;