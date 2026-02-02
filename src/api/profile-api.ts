import { ApiBase } from './api-base';
import type { User } from '../stores/user-store';
import type {SignUpData} from './user-api.ts';

export interface ProfileData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export class ProfileApi extends ApiBase {
  constructor() {
    super('/user');
  }

  public updateProfile(data: SignUpData): Promise<User> {
    return this.put('/profile', { data });
  }

  public updatePassword(data: { oldPassword: string, newPassword: string }): Promise<any> {
    return this.put('/password', { data });
  }

  public updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.put('/profile/avatar', {
      data: formData,
    });
  }
}
