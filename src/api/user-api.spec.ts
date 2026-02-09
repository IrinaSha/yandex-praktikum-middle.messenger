import {
  describe, expect, jest, test, beforeEach,
} from '@jest/globals';
import { ApiBase } from './api-base';
import { UserApi } from './user-api';

describe('UserApi', () => {
  const API_BASE_URL = 'https://ya-praktikum.tech/api/v2';
  const LOGIN_PATH = '/signin';
  const SIGNUP_PATH = '/signup';
  const USER_PATH = '/user';
  const LOGOUT_PATH = '/logout';

  const MOCK_LOGIN = 'test';
  const MOCK_PASSWORD = '123';
  const MOCK_FIRST_NAME = 'f';
  const MOCK_SECOND_NAME = 's';
  const MOCK_DISPLAY_NAME = 'd';
  const MOCK_EMAIL = 'e';
  const MOCK_PHONE = '1';

  const MOCK_USER_ID = 1;
  const MOCK_OK = 'OK';

  let api: UserApi;

  beforeEach(() => {
    api = new UserApi();
    (api as any).baseUrl = API_BASE_URL;
  });

  test('should call signIn', async () => {
    const mockData = { login: MOCK_LOGIN, password: MOCK_PASSWORD };
    const postSpy = jest
      .spyOn(ApiBase.prototype as any, 'post')
      .mockResolvedValue({});

    const result = await api.signIn(mockData);

    expect(postSpy).toHaveBeenCalledWith(LOGIN_PATH, { data: mockData });
    expect(result).toEqual({});
  });

  test('should call signUp', async () => {
    const mockData = {
      login: MOCK_LOGIN,
      password: MOCK_PASSWORD,
      first_name: MOCK_FIRST_NAME,
      second_name: MOCK_SECOND_NAME,
      display_name: MOCK_DISPLAY_NAME,
      email: MOCK_EMAIL,
      phone: MOCK_PHONE,
    };

    const postSpy = jest
      .spyOn(ApiBase.prototype as any, 'post')
      .mockResolvedValue({ id: MOCK_USER_ID });

    const result = await api.signUp(mockData);

    expect(postSpy).toHaveBeenCalledWith(SIGNUP_PATH, { data: mockData });
    expect(result).toEqual({ id: MOCK_USER_ID });
  });

  test('should call getUser', async () => {
    const mockUser = { id: MOCK_USER_ID, login: MOCK_LOGIN };

    const getSpy = jest
      .spyOn(ApiBase.prototype as any, 'get')
      .mockResolvedValue(mockUser);

    const result = await api.getUser();

    expect(getSpy).toHaveBeenCalledWith(USER_PATH);
    expect(result).toEqual(mockUser);
  });

  test('should call logout', async () => {
    const postSpy = jest
      .spyOn(ApiBase.prototype as any, 'post')
      .mockResolvedValue(MOCK_OK);

    const result = await api.logout();

    expect(postSpy).toHaveBeenCalledWith(LOGOUT_PATH);
    expect(result).toBe(MOCK_OK);
  });
});
