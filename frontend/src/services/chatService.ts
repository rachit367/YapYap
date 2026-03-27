import apiClient from "../utils/apiClient";

export interface Conversation {
    _id: string;
    participants: {
        _id: string;
        username: string;
        fullName: string;
        connectCode: string;
    }[];
    lastMessage?: {
        _id: string;
        senderId: string;
        content: string;
        createdAt: string;
    };
    updatedAt: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
}

export const chatService = {
    getConversations: async () => {
        const response = await apiClient.get('/conversations');
        return response.data;
    },

    createConversation: async (targetUserId: string) => {
        const response = await apiClient.post('/conversations', { targetUserId });
        return response.data;
    },

    getMessages: async (conversationId: string) => {
        const response = await apiClient.get(`/messages/${conversationId}`);
        return response.data;
    },

    sendMessage: async (conversationId: string, content: string) => {
        const response = await apiClient.post(`/messages/${conversationId}`, { content });
        return response.data;
    },
    
    searchUsers: async (query: string) => {
        const response = await apiClient.get(`/auth/users/search?q=${query}`);
        return response.data;
    }
};
