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

export interface CreateChatData {
  title: string;
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
    const queryParams = new URLSearchParams();

    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.title) {
      queryParams.append('title', params.title);
    }

    const query = queryParams.toString();
    const endpoint = query ? `?${query}` : '';

    return this.get<Chat[]>(endpoint);
  }

  public createChat(data: CreateChatData): Promise<CreateChatResponse> {
    return this.post<CreateChatResponse>('', { data });
  }

  public getChatUsers(
    chatId: number,
    params: GetChatUsersParams = {}
  ): Promise<ChatUser[]> {
    const queryParams = new URLSearchParams();

    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.name) {
      queryParams.append('name', params.name);
    }
    if (params.email) {
      queryParams.append('email', params.email);
    }

    const query = queryParams.toString();
    const endpoint = `/${chatId}/users${query ? `?${query}` : ''}`;

    return this.get<ChatUser[]>(endpoint);
  }

  public deleteChat(chatId: number): Promise<any> {
    return this.delete('', { data: { chatId } });
  }

  public addUsersToChat(chatId: number, userIds: number[]): Promise<any> {
    return this.put('/users', {
      data: {
        users: userIds,
        chatId,
      },
    });
  }

  public removeUsersFromChat(chatId: number, userIds: number[]): Promise<any> {
    return this.delete('/users', {
      data: {
        users: userIds,
        chatId,
      },
    });
  }
}
