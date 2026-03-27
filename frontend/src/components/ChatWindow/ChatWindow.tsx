import React, { useEffect } from 'react'
import ChatPlaceholder from './Chatplaceholder'
import { useChatStore } from '../../stores/chatStore'
import { useAuthStore } from '../../stores/authStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { chatService } from '../../services/chatService'

const ChatWindow: React.FC = () => {
    const { selectedConversation, setMessages, setIsLoading, onlineUsers, typingUsers } = useChatStore()
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation) return

            setIsLoading(true)
            try {
                const res = await chatService.getMessages(selectedConversation._id)
                if (res.success) {
                    setMessages(res.messages)
                }
            } catch (err) {
                console.error('Failed to fetch messages', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMessages()
    }, [selectedConversation, setMessages, setIsLoading])

    if (!selectedConversation) {
        return (
            <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center">
                <ChatPlaceholder />
            </div>
        )
    }

    const otherUser = selectedConversation.participants.find(p => p._id !== user?.id) || selectedConversation.participants[0]
    const isOnline = onlineUsers.includes(otherUser?._id)
    const isTyping = typingUsers[otherUser?._id]

    return (
        <div className="min-h-screen w-full bg-white flex flex-col justify-between">
            <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {otherUser?.fullName.charAt(0).toUpperCase()}
                        </div>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{otherUser?.fullName}</h2>
                        <span className="text-sm text-gray-500">
                            {isTyping ? <span className="text-indigo-500 italic">typing...</span> : isOnline ? 'Online' : `@${otherUser?.username}`}
                        </span>
                    </div>
                </div>
            </div>

            <MessageList />

            <MessageInput />
        </div>
    )
}

export default ChatWindow