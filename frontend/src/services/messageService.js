import api from './api';

export const messageService = {
  async getConversations() {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  async getMessages(conversationId, page = 1) {
    const response = await api.get(`/messages/conversations/${conversationId}`, {
      params: { page }
    });
    return response.data;
  },

  async sendMessage(recipientId, listingId, content, attachments = []) {
    const response = await api.post('/messages', {
      recipientId,
      listingId,
      content,
      attachments
    });
    return response.data;
  },

  async startConversation(listingId, message) {
    const response = await api.post('/messages/start-conversation', {
      listingId,
      message
    });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/messages/unread-count');
    return response.data;
  }
};

export default messageService;
