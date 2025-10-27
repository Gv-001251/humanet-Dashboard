import { api } from './api';

type NotificationType = 'candidate' | 'interview' | 'offer' | 'project' | 'general';

export interface MessageNotification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
}

interface NotificationsResponse {
  success: boolean;
  data: MessageNotification[];
}

interface ActionResponse {
  success: boolean;
  message?: string;
}

interface SendEmailPayload {
  recipient: string;
  subject: string;
  body: string;
}

export const messagesService = {
  async getNotifications() {
    return api.get<NotificationsResponse>('/messages/notifications');
  },
  async markAsRead(id: string) {
    return api.put<ActionResponse>(`/messages/${id}/read`);
  },
  async sendEmail(payload: SendEmailPayload) {
    return api.post<ActionResponse>('/messages/send-email', payload);
  }
};
