const Message = require('../models/message')
const Conversation = require('../models/conversation')
const { getReceiverSocketId, getIo } = require('../socket/socketHandler')

async function handleSendMessage(conversationId, senderId, content) {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: senderId
    })

    if (!conversation) {
        return { error: 'CONVERSATION_NOT_FOUND' }
    }

    const newMessage = await Message.create({
        conversationId,
        senderId,
        content
    })

    conversation.lastMessage = newMessage._id
    await conversation.save()

    const receiverIds = conversation.participants.filter(id => id.toString() !== senderId.toString())

    for (const receiverId of receiverIds) {
        const receiverSocketId = await getReceiverSocketId(receiverId.toString())
        if (receiverSocketId) {
            const io = getIo()
            io.to(receiverSocketId).emit('receive_message', newMessage.toObject())
        }
    }

    return { message: newMessage }
}

async function handleGetMessages(conversationId, userId) {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
    })

    if (!conversation) {
        return { error: 'CONVERSATION_NOT_FOUND' }
    }

    const messages = await Message.find({ conversationId })
        .sort({ createdAt: 1 })
        .lean()

    return { messages }
}

module.exports = {
    handleSendMessage,
    handleGetMessages
}
