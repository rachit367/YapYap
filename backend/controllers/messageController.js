const { handleSendMessage, handleGetMessages } = require('../services/messageService');

async function sendMessage(req, res, next) {
    try {
        const userId = req.user_id
        const { conversationId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const result = await handleSendMessage(conversationId, userId, content);

        if (result.error === 'CONVERSATION_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found or unauthorized'
            });
        }

        return res.status(201).json({
            success: true,
            message: result.message
        });
    } catch (err) {
        next(err);
    }
}

async function getMessages(req, res, next) {
    try {
        const userId = req.user_id;
        const { conversationId } = req.params;

        const result = await handleGetMessages(conversationId, userId);

        if (result.error === 'CONVERSATION_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found or unauthorized'
            });
        }

        return res.status(200).json({
            success: true,
            messages: result.messages
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    sendMessage,
    getMessages
};
