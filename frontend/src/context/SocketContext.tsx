import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { chatService } from '../services/chatService';

interface SocketContextProps {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { isAuthenticated } = useAuthStore();
    const { addMessage, setOnlineUsers, setTypingStatus } = useChatStore();

    useEffect(() => {
        if (isAuthenticated) {
            const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
                withCredentials: true
            });

            setSocket(socketInstance);

            socketInstance.on('receive_message', (message) => {
                addMessage(message);

                const { conversations, updateConversationLastMessage, setConversations } = useChatStore.getState();
                const conversationExists = conversations.find(c => c._id === message.conversationId);

                if (conversationExists) {
                    updateConversationLastMessage(message.conversationId, message);
                } else {
                    chatService.getConversations().then(data => {
                        if (data.success) setConversations(data.conversations);
                    }).catch(console.error);
                }
            });

            socketInstance.on('online_users', (users: string[]) => {
                setOnlineUsers(users);
            });

            socketInstance.on('user_typing', ({ userId, isTyping }: { userId: string, isTyping: boolean }) => {
                setTypingStatus(userId, isTyping);
            });

            return () => {
                socketInstance.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
