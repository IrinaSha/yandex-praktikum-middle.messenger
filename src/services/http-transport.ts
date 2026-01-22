import { HTTP_METHODS, HTTP_ERROR_MESSAGES, MIN_SUCCESS_REQUEST_STATUS, MAX_SUCCESS_REQUEST_STATUS, DEFAULT_TIMEOUT } from './consts';
import type { HttpMethod, HttpRequestOptions } from './types';

export class HTTPTransport {
  private basePath: string;

  constructor(basePath: string = '') {
    this.basePath = basePath;
  }

  public get = this.createMethod(HTTP_METHODS.GET);
  public post = this.createMethod(HTTP_METHODS.POST);
  public put = this.createMethod(HTTP_METHODS.PUT);
  public delete = this.createMethod(HTTP_METHODS.DELETE);

  private createMethod(method: HttpMethod) {
    return <T = unknown>(url: string, options: HttpRequestOptions = {}): Promise<T> =>
      this.request<T>(url, { ...options, method });
  }

  private request<Response>(url: string, options: HttpRequestOptions): Promise<Response> {
    const {
      method = HTTP_METHODS.GET,
      data,
      headers,
      signal,
      timeout = DEFAULT_TIMEOUT,
      withCredentials = true,
      responseType = 'json'
    } = options;

    return new Promise<Response>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === HTTP_METHODS.GET;

      xhr.open(method, `${this.basePath}${url}`);

      if (signal) {
        signal.addEventListener('abort', () => xhr.abort());
      }

      xhr.onload = function () {
        const status = xhr.status || 0;

        if (status >= MIN_SUCCESS_REQUEST_STATUS && status <= MAX_SUCCESS_REQUEST_STATUS) {
          resolve(xhr.response);
        } else {
          const statusGroup = status as keyof typeof HTTP_ERROR_MESSAGES;
          const message = HTTP_ERROR_MESSAGES[statusGroup];

          reject({ status, reason: xhr.response?.reason || message });
        }
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Request failed'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.timeout = timeout;
      xhr.withCredentials = withCredentials;
      xhr.responseType = responseType;

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
