const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authenticateToken');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.get('/:conversationId', authenticateToken, getMessages);
router.post('/:conversationId', authenticateToken, sendMessage);

module.exports = router;
