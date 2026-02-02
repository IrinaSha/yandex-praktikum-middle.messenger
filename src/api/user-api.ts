import { ApiBase } from './api-base';
import type { User } from '../stores/user-store';

export interface SignUpData {
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export class UserApi extends ApiBase {
  constructor() {
    super('/auth');
  }

  public signIn(data: Record<string, string>): Promise<string> {
    return this.post('/signin', { data });
  }

  public signUp(data: SignUpData): Promise<{ id: number }> {
    return this.post('/signup', { data });
  }

  public getUser(): Promise<User> {
    return this.get('/user');
  }

  public logout(): Promise<string> {
    return this.post('/logout');
  }
}
