import { EventBus } from '../services/event-bus';
import { ChatApi } from '../api/chat-api';
import type {
  Chat,
  CreateChatData,
  ChatUser,
  GetChatsParams,
  GetChatUsersParams
} from '../api/chat-api';

export interface ChatWithUsers extends Chat {
  users: ChatUser[];
  messages: any[]; // Позже добавим тип для сообщений
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
  private state: ChatStoreState = {
    chats: new Map(),
    currentChatId: null,
    isLoading: false,
    error: null,
  };

  private constructor() {
    this.eventBus = new EventBus();
    this.chatApi = new ChatApi();
  }

  public static getInstance(): ChatStore {
    if (!ChatStore.__instance) {
      ChatStore.__instance = new ChatStore();
    }
    return ChatStore.__instance;
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

  public getChats(): ChatWithUsers[] {
    return Array.from(this.state.chats.values());
  }

  public getChat(chatId: number): ChatWithUsers | undefined {
    return this.state.chats.get(chatId);
  }

  public getCurrentChat(): ChatWithUsers | null {
    if (this.state.currentChatId === null) {
      return null;
    }
    return this.state.chats.get(this.state.currentChatId) || null;
  }

  public getCurrentChatId(): number | null {
    return this.state.currentChatId;
  }

  public setCurrentChat(chatId: number | null): void {
    this.setState({ currentChatId: chatId });
    this.eventBus.emit('current-chat-changed', chatId);
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

  public async createChat(data: CreateChatData): Promise<number> {
    this.setState({ isLoading: true, error: null });

    try {
      const response = await this.chatApi.createChat(data);

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

  public async addUsersToChat(chatId: number, userIds: number[]): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      await this.chatApi.addUsersToChat(chatId, userIds);

      // Обновляем список пользователей чата
      await this.fetchChatUsers(chatId);

      this.setState({ isLoading: false });
      this.eventBus.emit('users-added-to-chat', { chatId, userIds });
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка добавления пользователей';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('add-users-error', errorMessage);
      throw error;
    }
  }

  public async removeUsersFromChat(chatId: number, userIds: number[]): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      await this.chatApi.removeUsersFromChat(chatId, userIds);

      // Обновляем список пользователей чата
      await this.fetchChatUsers(chatId);

      this.setState({ isLoading: false });
      this.eventBus.emit('users-removed-from-chat', { chatId, userIds });
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка удаления пользователей';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('remove-users-error', errorMessage);
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
}

export const chatStore = ChatStore.getInstance();
