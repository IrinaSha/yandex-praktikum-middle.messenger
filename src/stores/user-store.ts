import { EventBus } from '../services/event-bus';
import { UserApi } from '../api/user-api';

export type User = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string | null;
  avatar: string | null;
  phone: string;
  email: string;
}

type UserStoreState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export class UserStore {
  private static __instance: UserStore;
  private eventBus: EventBus;
  private userApi: UserApi;
  private state: UserStoreState = {
    user: null,
    isLoading: false,
    error: null,
  };

  private constructor() {
    this.eventBus = new EventBus();
    this.userApi = new UserApi();
  }

  public static getInstance(): UserStore {
    if (!UserStore.__instance) {
      UserStore.__instance = new UserStore();
    }
    return UserStore.__instance;
  }

  public on(event: string, callback: (data?: any) => void): () => void {
    this.eventBus.on(event, callback);
    return () => this.eventBus.off(event, callback);
  }

  public getState(): UserStoreState {
    return { ...this.state };
  }

  public getUser(): User | null {
    return this.state.user;
  }

  public isAuthenticated(): boolean {
    return this.state.user !== null;
  }

  private setState(newState: Partial<UserStoreState>): void {
    this.state = { ...this.state, ...newState };
    this.eventBus.emit('state-changed', this.state);
  }

  // Проверка авторизации при старте приложения
  public async checkAuth(): Promise<boolean> {
    try {
      const user = await this.userApi.getUser();
      this.setState({ user, isLoading: false, error: null });
      console.log('Пользователь авторизован:', user);
      return true;
    } catch (error: any) {
      console.log('Пользователь не авторизован');
      this.setState({ user: null, isLoading: false, error: null });
      return false;
    }
  }

  public async signIn(data: Record<string, string>): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      await this.userApi.signIn(data);
      await this.fetchUser();
      this.eventBus.emit('user-logged-in', this.state.user);
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка входа';
      this.setState({ error: errorMessage, isLoading: false });
      this.eventBus.emit('login-error', errorMessage);
      throw error;
    }
  }

  public async fetchUser(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const user = await this.userApi.getUser();
      this.setState({ user, isLoading: false });
      this.eventBus.emit('user-fetched', user);
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка получения данных';
      this.setState({ error: errorMessage, isLoading: false, user: null });
      throw error;
    }
  }

  public async logout(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      await this.userApi.logout();
      this.setState({ user: null, isLoading: false });
      this.eventBus.emit('user-logged-out');
    } catch (error: any) {
      const errorMessage = error.reason || 'Ошибка выхода';
      this.setState({ error: errorMessage, isLoading: false });
      throw error;
    }
  }

  public clearError(): void {
    this.setState({ error: null });
  }
}

export const userStore = UserStore.getInstance();
