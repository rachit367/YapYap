import React, { useState, useRef } from 'react';
import { SendIcon } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { chatService } from '../../services/chatService';
import { useSocket } from '../../context/SocketContext';
import { useAuthStore } from '../../stores/authStore';

const MessageInput: React.FC = () => {
    const [content, setContent] = useState('');
    const { selectedConversation, addMessage } = useChatStore();
    const { socket } = useSocket();
    const { user } = useAuthStore();
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);

        if (socket && selectedConversation) {
            const receiverId = selectedConversation.participants.find(p => p._id !== user?.id)?._id;
            if (!receiverId) return;

            socket.emit('typing_start', { receiverId });

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing_stop', { receiverId });
            }, 1500);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() || !selectedConversation) return;

        try {
            const res = await chatService.sendMessage(selectedConversation._id, content);
            if (res.success) {
                addMessage(res.message);
                setContent('');
                
                if (socket) {
                    const receiverId = selectedConversation.participants.find(p => p._id !== user?.id)?._id;
                    if (receiverId) {
                        socket.emit('typing_stop', { receiverId });
                    }
                }
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="h-20 bg-white border-t border-gray-200 px-6 py-4">
            <form onSubmit={handleSend} className="flex gap-2 h-full">
                <input
                    type="text"
                    value={content}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 rounded-full px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    <SendIcon size={20} className="ml-1" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
