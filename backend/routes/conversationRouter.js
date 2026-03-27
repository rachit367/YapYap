const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authenticateToken');
const { getConversations, createConversation } = require('../controllers/conversationController');

router.get('/', authenticateToken, getConversations);
router.post('/', authenticateToken, createConversation);

module.exports = router;
