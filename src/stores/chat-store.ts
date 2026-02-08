import { EventBus } from '../services/event-bus';
import { ChatApi } from '../api/chat-api';
import { ProfileApi } from '../api/profile-api';
import { WSTransport, WSTransportEvents } from '../services/ws-transport';
import { userStore } from './user-store';
import type {
  Chat,
  CreateChatData,
  ChatUser,
  GetChatsParams,
  GetChatUsersParams
} from '../api/chat-api';

export interface ChatWithUsers extends Chat {
  users: ChatUser[];
  messages: any[];
}

type ChatStoreState = {
  chats: Map<number, ChatWithUsers>;
  currentChatId: number | null;
  isLoading: boolean;
  error: string | null;
}

export class ChatStore {
  private static __instance: ChatStore;
  private eventBus: EventBus;
  private chatApi: ChatApi;
  private profileApi: ProfileApi;
  private transport: WSTransport | null = null;
  private state: ChatStoreState = {
    chats: new Map(),
    currentChatId: null,
    isLoading: false,
    error: null,
  };

  private constructor() {
    this.eventBus = new EventBus();
    this.chatApi = new ChatApi();
    this.profileApi = new ProfileApi();
  }

  public static getInstance(): ChatStore {
    if (!ChatStore.__instance) {
      ChatStore.__instance = new ChatStore();
    }
    return ChatStore.__instance;
  }

  private async connectToChat(chatId: number) {
    if (this.transport) {
      this.transport.close();
    }

    try {
      const { token } = await this.chatApi.getChatToken(chatId);
      const userId = userStore.getUser()?.id;
      const url = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

      this.transport = new WSTransport(url, new EventBus());

      this.transport.on(WSTransportEvents.Connected, () => {
        this.transport?.send({ type: 'get old', content: '0' });
      });

      this.transport.on(WSTransportEvents.Message, (data) => {
        this.handleNewMessages(chatId, data);
      });

      await this.transport.connect();
    } catch (e) {
      console.error('WS Connection error', e);
    }
  }

  private handleNewMessages(chatId: number, data: any) {
    const chat = this.state.chats.get(chatId);
    if (!chat) return;

    let newMessages = Array.isArray(data) ? data.reverse() : [data];

    newMessages = newMessages.filter(m => m.type === 'message' || !m.type);

    const updatedChat = {
      ...chat,
      messages: Array.isArray(data) ? newMessages : [...chat.messages, ...newMessages]
    };

    const newChats = new Map(this.state.chats);
    newChats.set(chatId, updatedChat);
    this.setState({ chats: newChats });
    this.eventBus.emit('messages-updated', chatId);
  }

  public sendMessage(content: string) {
    this.transport?.send({
      type: 'message',
      content
    });
  }

  public async setCurrentChat(chatId: number | null): Promise<void> {
    this.setState({ currentChatId: chatId });
    if (chatId) {
      await this.connectToChat(chatId);
    } else {
      this.transport?.close();
      this.transport = null;
    }
    this.eventBus.emit('current-chat-changed', chatId);
  }

  public on(event: string, callback: (data?: any) => void): () => void {
    this.eventBus.on(event, callback);
    return () => this.eventBus.off(event, callback);
  }

  public getState(): ChatStoreState {
    return {
      ...this.state,
      chats: new Map(this.state.chats),
    };
  }

  public getChat(chatId: number): ChatWithUsers | undefined {
    return this.state.chats.get(chatId);
  }

  public getCurrentChatId(): number | null {
    return this.state.currentChatId;
  }

  private setState(newState: Partial<ChatStoreState>): void {
    this.state = { ...this.state, ...newState };
    this.eventBus.emit('state-changed', this.state);
  }

  public async fetchChats(params: GetChatsParams = {}): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const chats = await this.chatApi.getChats(params);

      const chatsMap = new Map<number, ChatWithUsers>();

      chats.forEach(chat => {
        const existingChat = this.state.chats.get(chat.id);
        chatsMap.set(chat.id, {
          ...chat,
          users: existingChat?.users || [],
          messages: existingChat?.messages || [],
        });
      });

      this.setState({ chats: chatsMap, isLoading: false });
      this.eventBus.emit('chats-fetched', Array.from(chatsMap.values()));
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка загрузки чатов';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('chats-fetch-error', errorMessage);
      throw error;
    }
  }

  public async createChat(title: string): Promise<number> {
    this.setState({ isLoading: true, error: null });

    try {
      const response = await this.chatApi.createChat({ title });

      // Обновляем список чатов после создания
      await this.fetchChats();

      this.setState({ isLoading: false });
      this.eventBus.emit('chat-created', response.id);

      return response.id;
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка создания чата';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('chat-create-error', errorMessage);
      throw error;
    }
  }

  public async fetchChatUsers(
    chatId: number,
    params: GetChatUsersParams = {}
  ): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const users = await this.chatApi.getChatUsers(chatId, params);

      const chat = this.state.chats.get(chatId);
      if (chat) {
        const updatedChat: ChatWithUsers = {
          ...chat,
          users,
        };

        const newChats = new Map(this.state.chats);
        newChats.set(chatId, updatedChat);

        this.setState({ chats: newChats, isLoading: false });
        this.eventBus.emit('chat-users-fetched', { chatId, users });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка загрузки пользователей чата';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('chat-users-fetch-error', errorMessage);
      throw error;
    }
  }

  public async deleteChat(chatId: number): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      await this.chatApi.deleteChat(chatId);

      const newChats = new Map(this.state.chats);
      newChats.delete(chatId);

      const newCurrentChatId = this.state.currentChatId === chatId
        ? null
        : this.state.currentChatId;

      this.setState({
        chats: newChats,
        currentChatId: newCurrentChatId,
        isLoading: false
      });

      this.eventBus.emit('chat-deleted', chatId);
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка удаления чата';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('chat-delete-error', errorMessage);
      throw error;
    }
  }

  public async addUserToChat(userLogin: string): Promise<void> {
    this.setState({ isLoading: true, error: null })

    const chatId = this.getCurrentChatId();

    if (!chatId) {
      this.eventBus.emit('add-users-error', 'чат не найден');

      return;
    }

    const users = await this.profileApi.searchUsersByLogin(userLogin);

    if (!users || users.length === 0) {
      this.eventBus.emit('add-users-error', 'пользователь не найден');

      return;
    }

    const userId =  users[0].id;

    try {
      await this.chatApi.addUserToChat(chatId, userId);
      await this.fetchChatUsers(chatId);

      this.setState({ isLoading: false });
      this.eventBus.emit('users-added-to-chat', { chatId, userId });
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка добавления пользователей';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('add-users-error', errorMessage);
      throw error;
    }
  }

  public async removeUsersFromChat(userLogin: string): Promise<void> {
    this.setState({ isLoading: true, error: null });

    const chatId = this.getCurrentChatId();

    if (!chatId) {
      this.eventBus.emit('add-users-error', 'чат не найден');

      return;
    }

    const users = await this.profileApi.searchUsersByLogin(userLogin);

    if (!users || users.length === 0) {
      this.eventBus.emit('add-users-error', 'пользователь не найден');

      return;
    }

    const userId =  users[0].id;

    try {
      await this.chatApi.removeUserFromChat(chatId, userId);
      await this.fetchChatUsers(chatId);

      this.setState({ isLoading: false });
      this.eventBus.emit('users-removed-from-chat', { chatId, userId });
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка удаления пользователей';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('remove-users-error', errorMessage);
      throw error;
    }
  }

  public async getChatToken(chatId: number): Promise<{ token: string }> {
    try {
      const tokenData = await this.chatApi.getChatToken(chatId);
      this.eventBus.emit('chat-token', { chatId, token: tokenData.token });
      return tokenData;
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка получения токена';
      this.eventBus.emit('chat-token-error', errorMessage);
      throw error;
    }
  }

  public clearError(): void {
    this.setState({ error: null });
  }

  public clear(): void {
    this.setState({
      chats: new Map(),
      currentChatId: null,
      isLoading: false,
      error: null,
    });
  }
  public getChats = () => Array.from(this.state.chats.values());

  public getCurrentChat = () => this.state.currentChatId ? this.state.chats.get(this.state.currentChatId) : null;
}

export const chatStore = ChatStore.getInstance();
