import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { ApiBase } from './api-base';
import { HTTPTransport } from '../services/http-transport';

jest.mock('../services/http-transport', () => ({
  HTTPTransport: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

class TestApi extends ApiBase {
  constructor(path: string) {
    super(path);
  }

  public async testGet(url?: string, options?: any): Promise<any> {
    return this.get(url, options);
  }

  public async testPost(endpoint?: string, options?: any): Promise<any> {
    return this.post(endpoint, options);
  }

  public async testPut(endpoint?: string, options?: any): Promise<any> {
    return this.put(endpoint, options);
  }

  public async testDelete(endpoint?: string, options?: any): Promise<any> {
    return this.delete(endpoint, options);
  }
}

describe('Api Base Service', () => {
  let api: TestApi;
  let mockTransportInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new TestApi('/test');
    mockTransportInstance = (api as any).transport;
  });

  describe('Constructor', () => {
    it('should initialize transport with full URL', () => {
      expect(HTTPTransport).toHaveBeenCalled();
    });
  });

  describe('GET requests', () => {
    it('should call get method with default empty string endpoint', async () => {
      mockTransportInstance.get.mockResolvedValueOnce('ok');

      await api.testGet();

      expect(mockTransportInstance.get).toHaveBeenCalledWith('', undefined);
    });

    it('should call get method of transport with endpoint', async () => {
      const mockResponse = { data: 'success' };
      mockTransportInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await api.testGet('/list');

      expect(mockTransportInstance.get).toHaveBeenCalledWith('/list', undefined);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('POST requests', () => {
    it('should call post method with data and handle default endpoint', async () => {
      mockTransportInstance.post.mockResolvedValueOnce({ ok: true });

      await api.testPost(undefined, { data: { id: 1 } });

      expect(mockTransportInstance.post).toHaveBeenCalledWith('', { data: { id: 1 } });
    });

    it('should call post method with full arguments', async () => {
      const data = { name: 'test' };
      await api.testPost('/create', { data });

      expect(mockTransportInstance.post).toHaveBeenCalledWith('/create', { data });
    });
  });

  describe('PUT requests', () => {
    it('should call put method and handle default endpoint', async () => {
      mockTransportInstance.put.mockResolvedValueOnce({});
      await api.testPut();
      expect(mockTransportInstance.put).toHaveBeenCalledWith('', undefined);
    });

    it('should call put method with options', async () => {
      const updateData = { version: 2 };
      await api.testPut('/update/1', { data: updateData });
      expect(mockTransportInstance.put).toHaveBeenCalledWith('/update/1', { data: updateData });
    });
  });

  describe('DELETE requests', () => {
    it('should call delete method and handle default endpoint', async () => {
      mockTransportInstance.delete.mockResolvedValueOnce({});
      await api.testDelete();
      expect(mockTransportInstance.delete).toHaveBeenCalledWith('', undefined);
    });

    it('should call delete with options', async () => {
      await api.testDelete('/1', { timeout: 100 });
      expect(mockTransportInstance.delete).toHaveBeenCalledWith('/1', { timeout: 100 });
    });
  });

  describe('Error handling', () => {
    it('should propagate transport errors', async () => {
      const error = new Error('Network error');
      mockTransportInstance.get.mockRejectedValueOnce(error);

      await expect(api.testGet('/fail')).rejects.toThrow('Network error');
    });
  });
});
