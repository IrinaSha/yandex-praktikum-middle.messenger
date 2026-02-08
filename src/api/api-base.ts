import { HTTPTransport } from '../services/http-transport';
import type { HttpRequestOptions } from '../services/types';
import { BASE_URL } from './consts';

export abstract class ApiBase {
  protected transport: HTTPTransport;

  protected constructor(path: string) {
    this.transport = new HTTPTransport(`${BASE_URL}${path}`);
  }

  protected get<T = string
      | number
      | boolean
      | null
      | undefined
      | symbol
      | []
      | Record<string, unknown>
      | unknown[]>(
    endpoint: string = '',
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.transport.get<T>(endpoint, options);
  }

  protected post<T = string
      | number
      | boolean
      | null
      | undefined
      | symbol
      | []
      | Record<string, unknown>
      | unknown[]>(
    endpoint: string = '',
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.transport.post<T>(endpoint, options);
  }

  protected put<T = string
      | number
      | boolean
      | null
      | undefined
      | symbol
      | []
      | Record<string, unknown>
      | unknown[]>(
    endpoint: string = '',
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.transport.put<T>(endpoint, options);
  }

  protected delete<T = string
      | number
      | boolean
      | null
      | undefined
      | symbol
      | []
      | Record<string, unknown>
      | unknown[]>(
    endpoint: string = '',
    options?: HttpRequestOptions,
  ): Promise<T> {
    return this.transport.delete<T>(endpoint, options);
  }
}
