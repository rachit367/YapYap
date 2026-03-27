import React, { useEffect } from 'react'
import { useChatStore } from '../../stores/chatStore'
import { chatService } from '../../services/chatService'
import { useAuthStore } from '../../stores/authStore'

const Conversations: React.FC = () => {
    const { conversations, setConversations, selectedConversation, setSelectedConversation } = useChatStore()
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await chatService.getConversations()
                if (data.success) {
                    setConversations(data.conversations)
                }
            } catch (error) {
                console.error('Failed to load conversations:', error)
            }
        }
        fetchConversations()
    }, [setConversations])

    const getOtherParticipant = (participants: any[]) => {
        return participants.find(p => p._id !== user?.id) || participants[0]
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations yet</div>
            ) : (
                conversations.map((conv) => {
                    const otherUser = getOtherParticipant(conv.participants)
                    const isSelected = selectedConversation?._id === conv._id
                    const isOnline = useChatStore.getState().onlineUsers.includes(otherUser?._id)

                    return (
                        <div
                            key={conv._id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 ${
                                isSelected ? 'bg-indigo-50 border-indigo-100' : ''
                            }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {otherUser?.fullName?.charAt(0).toUpperCase() || '?'}
                                </div>
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-gray-800 truncate">
                                        {otherUser?.fullName || 'Unknown User'}
                                    </h3>
                                    {conv.lastMessage && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {conv.lastMessage ? conv.lastMessage.content : 'No messages yet'}
                                </p>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default Conversations
