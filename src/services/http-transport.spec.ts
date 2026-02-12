import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { HTTPTransport } from './http-transport';
import { HTTP_ERROR_MESSAGES } from './consts';

describe('HTTPTransport', () => {
  const MOCK_URL = 'users';
  let mockXHR: any;
  let transport: HTTPTransport;

  beforeEach(() => {
    mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      abort: jest.fn(),
      readyState: 4,
    };

    Object.defineProperties(mockXHR, {
      status: { writable: true, value: 200 },
      response: { writable: true, value: null },
      timeout: { writable: true, value: 0 },
      withCredentials: { writable: true, value: false },
      responseType: { writable: true, value: '' },
    });

    window.XMLHttpRequest = jest.fn(() => mockXHR) as any;
    transport = new HTTPTransport('/api/');
  });

  const emit = (event: 'onload' | 'onerror' | 'onabort' | 'ontimeout') => {
    if (mockXHR[event]) mockXHR[event]();
  };

  it('должен выполнять GET запрос и возвращать данные', async () => {
    const response = { data: 'test' };
    mockXHR.response = response;

    const promise = transport.get(MOCK_URL);
    emit('onload');

    expect(await promise).toEqual(response);
    expect(mockXHR.open).toHaveBeenCalledWith('GET', '/api/users');
  });

  it('должен отправлять POST с JSON данными и заголовками', async () => {
    const data = { foo: 'bar' };
    const promise = transport.post(MOCK_URL, { data, headers: { Custom: 'Header' } });
    emit('onload');
    await promise;

    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Custom', 'Header');
    expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify(data));
  });

  it('должен отправлять FormData без установки Content-Type вручную', async () => {
    const data = new FormData();
    const promise = transport.put(MOCK_URL, { data });
    emit('onload');
    await promise;

    expect(mockXHR.send).toHaveBeenCalledWith(data);
    expect(mockXHR.setRequestHeader).not.toHaveBeenCalledWith('Content-Type', 'application/json');
  });

  it('должен обрабатывать ошибки сети и таймауты', async () => {
    const cases = [
      { trigger: () => emit('onerror'), error: 'Request failed' },
      { trigger: () => emit('ontimeout'), error: 'Request timeout' },
      { trigger: () => emit('onabort'), error: 'Request aborted' },
      { trigger: () => { mockXHR.status = 500; emit('onload'); }, error: HTTP_ERROR_MESSAGES[500] },
    ];

    await Promise.all(cases.map(async (item) => {
      const promise = transport.get(MOCK_URL);
      item.trigger();
      await expect(promise).rejects.toThrow(item.error);
    }));
  });

  it('должен поддерживать AbortSignal и параметры запроса', async () => {
    const controller = new AbortController();
    transport.get(MOCK_URL, {
      signal: controller.signal,
      timeout: 100,
      withCredentials: false,
      responseType: 'text',
    });

    controller.abort();
    expect(mockXHR.abort).toHaveBeenCalled();
    expect(mockXHR.timeout).toBe(100);
    expect(mockXHR.withCredentials).toBe(false);
    expect(mockXHR.responseType).toBe('text');
  });

  it('должен корректно работать с пустым basePath', async () => {
    const emptyTransport = new HTTPTransport();
    emptyTransport.delete('/test');
    expect(mockXHR.open).toHaveBeenCalledWith('DELETE', '/test');
  });
});
