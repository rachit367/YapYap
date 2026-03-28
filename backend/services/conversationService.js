const Conversation = require('../models/conversation')
const User = require('../models/userModel')

async function handleGetConversations(userId) {
    const conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'username fullName connectCode')
        .populate('lastMessage')
        .sort({ updatedAt: -1 })
        .lean()

    return conversations
}

async function handleCreateConversation(userOneId, userTwoId) {
    if (userOneId === userTwoId) {
        return { error: 'CANNOT_CREATE_WITH_SELF' }
    }

    let existingConversation = await Conversation.findOne({
        participants: { $all: [userOneId, userTwoId] }
    })

    if (existingConversation) {
        await existingConversation.populate('participants', 'username fullName connectCode')
        return { conversation: existingConversation }
    }

    const [user1, user2] = await Promise.all([
        User.findById(userOneId),
        User.findById(userTwoId)
    ])

    if (!user1 || !user2) {
        return { error: 'USER_NOT_FOUND' }
    }

    const newConversation = await Conversation.create({
        participants: [userOneId, userTwoId]
    })

    await newConversation.populate('participants', 'username fullName connectCode')
    return { conversation: newConversation }
}

module.exports = {
    handleGetConversations,
    handleCreateConversation
}
