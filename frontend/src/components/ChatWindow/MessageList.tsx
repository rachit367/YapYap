import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';

const MessageList: React.FC = () => {
    const { messages, isLoading } = useChatStore();
    const { user } = useAuthStore();
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (isLoading) {
        return (
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    No messages yet. Say hi!
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === user?.id;
                    return (
                        <div
                            key={msg._id || index}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                                    isOwnMessage 
                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}
                            >
                                <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                                <span className={`text-[10px] block mt-1 ${isOwnMessage ? 'text-indigo-200 text-right' : 'text-gray-400 text-left'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={endRef} />
        </div>
    );
};

export default MessageList;
