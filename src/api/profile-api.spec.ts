import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { ApiBase } from './api-base';
import { ProfileApi } from './profile-api';

describe('ProfileApi', () => {
  const API_BASE_URL = 'https://ya-praktikum.tech/api/v2/user';
  const PROFILE_PATH = '/profile';
  const PASSWORD_PATH = '/password';
  const AVATAR_PATH = '/profile/avatar';
  const SEARCH_PATH = '/search';

  const MOCK_USER = {
    id: 123,
    first_name: 'John',
    second_name: 'Doe',
    display_name: 'JohnDoe',
    login: 'johndoe',
    email: 'john@example.com',
    phone: '89991112233',
    avatar: '/path/to/avatar.jpg',
  };

  let api: ProfileApi;

  beforeEach(() => {
    api = new ProfileApi();
    (api as any).baseUrl = API_BASE_URL;
  });

  it('should call updateProfile', async () => {
    const mockData = {
      first_name: 'New',
      second_name: 'Name',
      display_name: 'NewName',
      login: 'newlogin',
      email: 'new@email.com',
      phone: '80000000000',
    };

    const putSpy = jest
      .spyOn(ApiBase.prototype as any, 'put')
      .mockResolvedValue(MOCK_USER);

    const result = await api.updateProfile(mockData as any);

    expect(putSpy).toHaveBeenCalledWith(PROFILE_PATH, { data: mockData });
    expect(result).toEqual(MOCK_USER);
  });

  it('should call updatePassword', async () => {
    const mockData = {
      oldPassword: 'oldPassword123',
      newPassword: 'newPassword123',
    };

    const putSpy = jest
      .spyOn(ApiBase.prototype as any, 'put')
      .mockResolvedValue('OK');

    const result = await api.updatePassword(mockData);

    expect(putSpy).toHaveBeenCalledWith(PASSWORD_PATH, { data: mockData });
    expect(result).toBe('OK');
  });

  it('should call updateAvatar', async () => {
    const mockFile = new File([''], 'avatar.png', { type: 'image/png' });

    const appendSpy = jest.spyOn(FormData.prototype, 'append');
    const putSpy = jest
      .spyOn(ApiBase.prototype as any, 'put')
      .mockResolvedValue(MOCK_USER);

    const result = await api.updateAvatar(mockFile);

    expect(appendSpy).toHaveBeenCalledWith('avatar', mockFile);

    expect(putSpy).toHaveBeenCalledWith(AVATAR_PATH, {
      data: expect.any(FormData),
    });

    expect(result).toEqual(MOCK_USER);
  });

  it('should call searchUsersByLogin', async () => {
    const mockLogin = 'testuser';
    const mockResponse = [MOCK_USER];
    const postSpy = jest
      .spyOn(ApiBase.prototype as any, 'post')
      .mockResolvedValue(mockResponse);

    const result = await api.searchUsersByLogin(mockLogin);

    expect(postSpy).toHaveBeenCalledWith(SEARCH_PATH, {
      data: { login: mockLogin },
    });
    expect(result).toEqual(mockResponse);
  });
});
