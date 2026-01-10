import type { HttpRequestOptions } from './types';
import { queryStringify } from './utils';
import { HTTP_METHODS } from './consts';

export class HTTPTransport {
  get = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(
    url,
    { ...options, method: HTTP_METHODS.GET },
    options.timeout,
  );

  post = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(
    url,
    { ...options, method: HTTP_METHODS.POST },
    options.timeout,
  );

  put = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(
    url,
    { ...options, method: HTTP_METHODS.PUT },
    options.timeout,
  );

  delete = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(
    url,
    { ...options, method: HTTP_METHODS.DELETE },
    options.timeout,
  );

  request = (
    url: string,
    options: HttpRequestOptions = {},
    timeout: number = 5000,
  ): Promise<XMLHttpRequest> => {
    const { headers = {}, method, data } = options;

    return new Promise<XMLHttpRequest>((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === HTTP_METHODS.GET;

      xhr.open(
        method,
        isGet && !!data && typeof data === 'object' && !(data instanceof FormData)
          ? `${url}${queryStringify(data as Record<string, unknown>)}`
          : url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Request failed'));

      xhr.timeout = timeout;
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data as XMLHttpRequestBodyInit);
      }
    });
  };
}
