import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { ApiBase } from './api-base';
import { HTTPTransport } from '../services/http-transport';

const mockTransport = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<HTTPTransport>;

class TestApi extends ApiBase {
  constructor(transport: HTTPTransport) {
    super('/test');
    (this as any).transport = transport;
  }

  public async testGet(url: string, options?: any): Promise<any> {
    return (this as any).transport.get(url, options);
  }

  public async testPost(endpoint: string, options?: any): Promise<any> {
    return (this as any).transport.post(endpoint, options);
  }

  public async testPut(endpoint: string, options?: any): Promise<any> {
    return (this as any).transport.put(endpoint, options);
  }

  public async testDelete(endpoint: string, options?: any): Promise<any> {
    return (this as any).transport.delete(endpoint, options);
  }
}

describe('Api Base Service', () => {
  let api: TestApi;

  beforeEach(() => {
    jest.clearAllMocks();
    api = new TestApi(mockTransport);
  });

  describe('GET requests', () => {
    it('should call get method of transport with endpoint', async () => {
      const mockResponse = { data: 'success' };
      mockTransport.get.mockResolvedValueOnce(mockResponse);

      const result = await api.testGet('/test');

      expect(mockTransport.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should call get method with options', async () => {
      const mockResponse = { data: 'success' };
      const options = { headers: { Authorization: 'Bearer token' } };
      mockTransport.get.mockResolvedValueOnce(mockResponse);

      await api.testGet('/test', options);

      expect(mockTransport.get).toHaveBeenCalledWith('/test', options);
    });
  });

  describe('POST requests', () => {
    it('should call post method with data', async () => {
      const mockResponse = { status: 201, data: { id: 1 } };
      const data = { name: 'test', value: 123 };
      mockTransport.post.mockResolvedValueOnce(mockResponse);

      const result = await api.testPost('/submit', { data });

      expect(mockTransport.post).toHaveBeenCalledWith('/submit', { data });
      expect(result).toEqual(mockResponse);
    });

    it('should handle post without options', async () => {
      const mockResponse = { status: 200 };
      mockTransport.post.mockResolvedValueOnce(mockResponse);

      await api.testPost('/create');

      expect(mockTransport.post).toHaveBeenCalledWith('/create', undefined);
    });
  });

  describe('PUT requests', () => {
    it('should call put method for updates', async () => {
      const mockResponse = { status: 200, message: 'updated' };
      const updateData = { name: 'updated', version: 2 };
      mockTransport.put.mockResolvedValueOnce(mockResponse);

      await api.testPut('/update/1', { data: updateData });

      expect(mockTransport.put).toHaveBeenCalledWith('/update/1', { data: updateData });
    });
  });

  describe('DELETE requests', () => {
    it('should call delete method', async () => {
      const mockResponse = { status: 204 };
      mockTransport.delete.mockResolvedValueOnce(mockResponse);

      await api.testDelete('/delete/1');

      expect(mockTransport.delete).toHaveBeenCalledWith('/delete/1', undefined);
    });

    it('should call delete with options', async () => {
      const mockResponse = { status: 204 };
      const options = { timeout: 5000 };
      mockTransport.delete.mockResolvedValueOnce(mockResponse);

      await api.testDelete('/delete/1', options);

      expect(mockTransport.delete).toHaveBeenCalledWith('/delete/1', options);
    });
  });

  describe('Error handling', () => {
    it('should propagate transport errors', async () => {
      const error = new Error('Network error');
      mockTransport.get.mockRejectedValueOnce(error);

      await expect(api.testGet('/fail')).rejects.toThrow('Network error');
      expect(mockTransport.get).toHaveBeenCalledWith('/fail', undefined);
    });
  });

  describe('Multiple sequential calls', () => {
    it('should handle multiple transport calls correctly', async () => {
      const responses = [
        { data: 'first' },
        { data: 'second' },
        { data: 'third' },
      ];

      mockTransport.get
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2]);

      const [first, second, third] = await Promise.all([
        api.testGet('/first'),
        api.testGet('/second'),
        api.testGet('/third'),
      ]);

      expect(mockTransport.get).toHaveBeenCalledTimes(3);
      expect(first).toEqual(responses[0]);
      expect(second).toEqual(responses[1]);
      expect(third).toEqual(responses[2]);
    });
  });
});
