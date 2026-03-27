import { create } from 'zustand';
import type { Conversation, Message } from '../services/chatService';

interface ChatState {
    conversations: Conversation[];
    messages: Message[];
    selectedConversation: Conversation | null;
    isLoading: boolean;
    onlineUsers: string[];
    typingUsers: Record<string, boolean>;
    setConversations: (conversations: Conversation[]) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setSelectedConversation: (conversation: Conversation | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setOnlineUsers: (users: string[]) => void;
    setTypingStatus: (userId: string, isTyping: boolean) => void;
    updateConversationLastMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    conversations: [],
    messages: [],
    selectedConversation: null,
    isLoading: false,
    onlineUsers: [],
    typingUsers: {},
    setConversations: (conversations) => set({ conversations }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setOnlineUsers: (users) => set({ onlineUsers: users }),
    setTypingStatus: (userId, isTyping) => set((state) => ({
        typingUsers: { ...state.typingUsers, [userId]: isTyping }
    })),
    updateConversationLastMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations
            .map(c => c._id === conversationId
                ? { ...c, lastMessage: { _id: message._id, senderId: message.senderId, content: message.content, createdAt: message.createdAt }, updatedAt: message.createdAt }
                : c
            )
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }))
}));
