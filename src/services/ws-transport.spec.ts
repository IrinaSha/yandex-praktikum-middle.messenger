import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { EventBus } from './event-bus';
import { WSTransport } from './ws-transport';
import { WSTransportEvents } from './consts';

declare global {
  interface Window {
    WebSocket: jest.MockedClass<typeof WebSocket>;
  }
}

describe('WSTransport', () => {
  const MOCK_URL = 'wss://ya-praktikum.tech/ws/chats/';
  const MOCK_DATA = { test: 'data' };
  const PING_INTERVAL = 50000;

  let mockSocket: any;
  let mockEventBus: jest.Mocked<EventBus>;
  let wsTransport: WSTransport;

  beforeEach(() => {
    jest.useFakeTimers();

    mockSocket = {
      addEventListener: jest.fn(),
      send: jest.fn(),
      close: jest.fn(),
      readyState: WebSocket.OPEN,
    };

    Object.defineProperty(window, 'WebSocket', {
      value: jest.fn(() => mockSocket),
      writable: true,
    });

    mockEventBus = {
      on: jest.fn(),
      emit: jest.fn(),
      off: jest.fn(),
    } as any;

    wsTransport = new WSTransport(MOCK_URL, mockEventBus as unknown as EventBus);
  });

  it('should create instance with correct URL', () => {
    wsTransport.connect();
    const mockWebSocket = (window.WebSocket as unknown as jest.Mock).mock;
    expect(mockWebSocket.calls[0]).toEqual([MOCK_URL]);
  });

  it('should throw an error if socket is null', () => {
    expect(() => wsTransport.send({ test: 'data' })).toThrow('Connection is not established');
  });

  it('should call socket.send with JSON stringified data when state is OPEN', () => {
    wsTransport.connect();

    (mockSocket as any).readyState = WebSocket.OPEN;

    const data = { type: 'ping', id: 123 };
    const expectedJson = JSON.stringify(data);

    wsTransport.send(data);

    expect(mockSocket.send).toHaveBeenCalledTimes(1);
    expect(mockSocket.send).toHaveBeenCalledWith(expectedJson);
  });

  it('should handle different data types (strings, numbers)', () => {
    wsTransport.connect();
    (mockSocket as any).readyState = WebSocket.OPEN;

    wsTransport.send('just a string');
    expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify('just a string'));

    wsTransport.send(42);
    expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify(42));
  });

  it('should connect successfully', async () => {
    const connectPromise = wsTransport.connect();

    const openHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'open')?.[1] as Function;

    const onCall = (mockEventBus.on as jest.Mock).mock.calls
      .find(([event]) => event === WSTransportEvents.Connected)?.[1] as Function;

    openHandler();
    onCall();

    await expect(connectPromise).resolves.toBeUndefined();
  });

  it('should reject connection on error', async () => {
    const connectPromise = wsTransport.connect();

    const onCall = (mockEventBus.on as jest.Mock).mock.calls
      .find(([event]) => event === WSTransportEvents.Error)?.[1] as Function;

    onCall();

    await expect(connectPromise).rejects.toThrow('Connection error');
  });

  it('should throw error when sending without connection', () => {
    mockSocket.readyState = 0;
    expect(() => wsTransport.send(MOCK_DATA)).toThrow('Connection is not established');
  });

  it('should handle message event and ignore pong', () => {
    wsTransport.connect();
    const messageHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'message')?.[1] as Function;

    messageHandler({ data: JSON.stringify(MOCK_DATA) });
    expect(mockEventBus.emit).toHaveBeenCalledWith(WSTransportEvents.Message, MOCK_DATA);

    jest.clearAllMocks();
    messageHandler({ data: JSON.stringify({ type: 'pong' }) });
    expect(mockEventBus.emit)
      .not.toHaveBeenCalledWith(WSTransportEvents.Message, expect.any(Object));
  });

  it('should handle close event and stop ping', () => {
    wsTransport.connect();
    const closeHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'close')?.[1] as Function;

    const mockCloseEvent = { code: 1000, reason: 'Normal closure' };
    closeHandler(mockCloseEvent);

    expect(mockEventBus.emit).toHaveBeenCalledWith(WSTransportEvents.Close, mockCloseEvent);
  });

  it('should handle error event', () => {
    wsTransport.connect();
    const errorHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'error')?.[1] as Function;

    const mockErrorEvent = new Event('error');
    errorHandler(mockErrorEvent);

    expect(mockEventBus.emit).toHaveBeenCalledWith(WSTransportEvents.Error, mockErrorEvent);
  });

  it('should handle message parsing error', () => {
    wsTransport.connect();
    const messageHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'message')?.[1] as Function;

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    messageHandler({ data: 'invalid json' });

    expect(consoleSpy).toHaveBeenCalledWith('WS Message parsing error', expect.any(Error));
    expect(mockEventBus.emit).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should setup ping interval on open event', () => {
    wsTransport.connect();
    const openHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'open')?.[1] as Function;

    openHandler();

    expect(mockEventBus.emit).toHaveBeenCalledWith(WSTransportEvents.Connected);

    jest.advanceTimersByTime(PING_INTERVAL);
    expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'ping' }));
  });

  it('should stop ping when stopPing is called', () => {
    wsTransport.connect();
    const openHandler = (mockSocket.addEventListener as jest.Mock).mock.calls
      .find(([event]) => event === 'open')?.[1] as Function;

    openHandler();

    wsTransport.close();

    jest.advanceTimersByTime(PING_INTERVAL);
    expect(mockSocket.send).not.toHaveBeenCalled();
  });

  it('should handle on method correctly', () => {
    const callback = jest.fn();
    wsTransport.on('test-event', callback);

    expect(mockEventBus.on).toHaveBeenCalledWith('test-event', callback);
  });

  it('should close connection and stop ping', () => {
    jest.useFakeTimers();
    wsTransport.connect();
    wsTransport.close();

    expect(mockSocket.close).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
