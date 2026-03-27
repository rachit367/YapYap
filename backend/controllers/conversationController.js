const { handleGetConversations, handleCreateConversation } = require('../services/conversationService');

async function getConversations(req, res, next) {
    try {
        const userId = req.user_id
        const conversations = await handleGetConversations(userId);

        return res.status(200).json({
            success: true,
            conversations
        });
    } catch (err) {
        next(err);
    }
}

async function createConversation(req, res, next) {
    try {
        const userId = req.user_id;
        const { targetUserId } = req.body;

        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: 'targetUserId is required'
            });
        }

        const result = await handleCreateConversation(userId, targetUserId);

        if (result.error === 'CANNOT_CREATE_WITH_SELF') {
            return res.status(400).json({
                success: false,
                message: 'Cannot create conversation with yourself'
            });
        }

        if (result.error === 'USER_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(201).json({
            success: true,
            conversation: result.conversation
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getConversations,
    createConversation
};
