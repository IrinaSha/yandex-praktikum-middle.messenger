import { ApiBase } from './api-base';
import type { User } from '../stores/user-store';

export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  created_by: number;
  unread_count: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string | null;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

export interface CreateChatResponse {
  id: number;
}

export interface ChatUser extends User {
  role: 'admin' | 'regular';
}

export interface GetChatsParams {
  offset?: number;
  limit?: number;
  title?: string;
}

export interface GetChatUsersParams {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
}

export class ChatApi extends ApiBase {
  constructor() {
    super('/chats');
  }

  public getChats(params: GetChatsParams = {}): Promise<Chat[]> {
    return this.get<Chat[]>('', { data: params });
  }

  public createChat(title: string): Promise<CreateChatResponse> {
    return this.post<CreateChatResponse>('', { data: { title } });
  }

  public getChatUsers(
    chatId: number,
    params: GetChatUsersParams = {},
  ): Promise<ChatUser[]> {
    return this.get<ChatUser[]>(`/${chatId}/users`, { data: params });
  }

  public addUserToChat(chatId: number, userId: number): Promise<any> {
    return this.put('/users', {
      data: {
        users: [userId],
        chatId,
      },
    });
  }

  public removeUserFromChat(chatId: number, userId: number): Promise<any> {
    return this.delete('/users', {
      data: {
        users: [userId],
        chatId,
      },
    });
  }

  public getChatToken(chatId: number): Promise<{ token: string }> {
    return this.post<{ token: string }>(`/token/${chatId}`);
  }
}
