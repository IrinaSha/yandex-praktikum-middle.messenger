import { HTTP_METHODS } from './consts.ts';
import { queryStringify } from './utils.ts';

export class HttpTransport {
    get = (url: string, options = {}) => {
// @ts-ignore
        return this.request(url, {...options, method: HTTP_METHODS.GET}, options.timeout);
    };

    post = (url: string, options = {}) => {
        // @ts-ignore
        return this.request(url, {...options, method: HTTP_METHODS.POST}, options.timeout);
    };

    put = (url: string, options = {}) => {
        // @ts-ignore
        return this.request(url, {...options, method: HTTP_METHODS.PUT}, options.timeout);
    };

    delete = (url: string, options = {}) => {
        // @ts-ignore
        return this.request(url, {...options, method: HTTP_METHODS.DELETE}, options.timeout);
    };

    //вынести в константы
    request = (url: string, options = {}, timeout = 5000) => {
        // @ts-ignore
        const {headers = {}, method, data} = options;

        return new Promise(function(resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === HTTP_METHODS.GET;

            xhr.open(
                method,
                isGet && !!data
                    ? `${url}${queryStringify(data)}`
                    : url,
            );

            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function() {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (isGet || !data) {
                xhr.send();
            } else {
                xhr.send(data);
            }
        });
    };
}
