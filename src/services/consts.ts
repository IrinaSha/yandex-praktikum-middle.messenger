export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const HTTP_ERROR_MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
} as const;


export const WSTransportEvents = {
  Connected: 'connected',
  Error: 'error',
  Message: 'message',
  Close:'close',
} as const;

export const MIN_SUCCESS_REQUEST_STATUS = 200;
export const MAX_SUCCESS_REQUEST_STATUS = 299;
export const DEFAULT_TIMEOUT = 5000;
export const WS_URL = 'wss://ya-praktikum.tech/ws/chats/';
