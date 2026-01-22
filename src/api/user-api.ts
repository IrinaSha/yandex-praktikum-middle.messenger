import { ApiBase } from './api-base';
import type { User } from '../stores/user-store';

export class UserApi extends ApiBase {
  constructor() {
    super('/auth');
  }

  public signIn(data: Record<string, string>): Promise<string> {
    return this.post('/signin', { data });
  }

  public getUser(): Promise<User> {
    return this.get('/user');
  }

  public logout(): Promise<string> {
    return this.post('/logout');
  }
}
