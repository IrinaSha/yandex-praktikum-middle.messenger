import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { ChatApi } from './chat-api';
import { HTTPTransport } from '../services/http-transport';

jest.mock('../services/http-transport');

const mockTransport = HTTPTransport as jest.MockedClass<typeof HTTPTransport>;
const mockTransportInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} as any;

let api: ChatApi;

describe('ChatApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTransport.mockImplementation(() => mockTransportInstance);
    api = new ChatApi();
  });

  describe('getChats', () => {
    it('should get chats with empty params', async () => {
      const mockChats = [{ id: 1, title: 'Test' }];
      mockTransportInstance.get.mockResolvedValueOnce({ response: mockChats });

      const result = await api.getChats();

      expect(result).toEqual({ response: mockChats });
      expect(mockTransportInstance.get).toHaveBeenCalledWith('', {
        data: {},
      });
    });

    it('should get chats with params', async () => {
      const params = { offset: 0, limit: 20, title: 'test' };
      const mockChats = [{ id: 1, title: 'Test' }];
      mockTransportInstance.get.mockResolvedValueOnce({ response: mockChats });

      const result = await api.getChats(params);

      expect(result).toEqual({ response: mockChats });
      expect(mockTransportInstance.get).toHaveBeenCalledWith('', {
        data: params,
      });
    });

    it('should throw error on network failure', async () => {
      const error = new Error('Network error');
      mockTransportInstance.get.mockRejectedValueOnce(error);

      await expect(api.getChats()).rejects.toThrow('Network error');
    });
  });

  describe('createChat', () => {
    it('should create chat successfully', async () => {
      const mockResponse = { id: 1 };
      mockTransportInstance.post.mockResolvedValueOnce({ response: mockResponse });

      const result = await api.createChat('New Chat');

      expect(result).toEqual({ response: mockResponse });
      expect(mockTransportInstance.post).toHaveBeenCalledWith('', {
        data: { title: 'New Chat' },
      });
    });

    it('should throw error on create chat failure', async () => {
      const error = new Error('Create failed');
      mockTransportInstance.post.mockRejectedValueOnce(error);

      await expect(api.createChat('Test')).rejects.toThrow('Create failed');
    });
  });

  describe('getChatUsers', () => {
    it('should get chat users with empty params', async () => {
      const chatId = 1;
      const mockUsers = [{ id: 1, first_name: 'User', role: 'regular' }];
      mockTransportInstance.get.mockResolvedValueOnce({ response: mockUsers });

      const result = await api.getChatUsers(chatId);

      expect(result).toEqual({ response: mockUsers });
      expect(mockTransportInstance.get).toHaveBeenCalledWith('/1/users', {
        data: {},
      });
    });

    it('should get chat users with params', async () => {
      const chatId = 1;
      const params = { limit: 10, name: 'John' };
      const mockUsers = [{ id: 1, first_name: 'John', role: 'admin' }];
      mockTransportInstance.get.mockResolvedValueOnce({ response: mockUsers });

      const result = await api.getChatUsers(chatId, params);

      expect(result).toEqual({ response: mockUsers });
      expect(mockTransportInstance.get).toHaveBeenCalledWith('/1/users', {
        data: params,
      });
    });
  });

  describe('addUserToChat', () => {
    it('should add user to chat', async () => {
      const chatId = 1;
      const userId = 123;
      mockTransportInstance.put.mockResolvedValueOnce({ response: null });

      await api.addUserToChat(chatId, userId);

      expect(mockTransportInstance.put).toHaveBeenCalledWith('/users', {
        data: { users: [userId], chatId },
      });
    });
  });

  describe('removeUserFromChat', () => {
    it('should remove user from chat', async () => {
      const chatId = 1;
      const userId = 123;
      mockTransportInstance.delete.mockResolvedValueOnce({ response: null });

      await api.removeUserFromChat(chatId, userId);

      expect(mockTransportInstance.delete).toHaveBeenCalledWith('/users', {
        data: { users: [userId], chatId },
      });
    });
  });

  describe('removeChat', () => {
    it('should remove chat', async () => {
      const chatId = 10499;
      mockTransportInstance.delete.mockResolvedValueOnce({ response: null });

      await api.deleteChat(chatId);

      expect(mockTransportInstance.delete).toHaveBeenCalledWith('', {
        data: { chatId },
      });
    });
  });

  describe('getChatToken', () => {
    it('should get chat token', async () => {
      const chatId = 1;
      const mockToken = { token: 'ws-token-123' };
      mockTransportInstance.post.mockResolvedValueOnce({ response: mockToken });

      const result = await api.getChatToken(chatId);

      expect(result).toEqual({ response: mockToken });
      expect(mockTransportInstance.post).toHaveBeenCalledWith(`/token/${chatId}`, undefined);
    });
  });

  describe('Multiple sequential operations', () => {
    it('should handle multiple chat operations', async () => {
      const mockChats = [{ id: 1, title: 'Test' }];
      const mockToken = { token: 'token' };

      mockTransportInstance.get
        .mockResolvedValueOnce({ response: mockChats });
      mockTransportInstance.post
        .mockResolvedValueOnce({ response: mockToken });

      const chats = await api.getChats();
      const token = await api.getChatToken(1);

      expect(mockTransportInstance.get).toHaveBeenCalledTimes(1);
      expect(mockTransportInstance.post).toHaveBeenCalledTimes(1);
      expect(chats).toEqual({ response: mockChats });
      expect(token).toEqual({ response: mockToken });
    });
  });
});
