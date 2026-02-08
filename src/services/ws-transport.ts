import { EventBus } from './event-bus';
import { WSTransportEvents } from './consts';


export class WSTransport {
  private socket: WebSocket | null = null;

  private pingInterval: number = 30000;

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private url: string;

  private eventBus: EventBus;

  constructor(url: string, eventBus: EventBus) {
    this.url = url;
    this.eventBus = eventBus;
  }

  public connect(): Promise<void> {
    this.socket = new WebSocket(this.url);

    this.subscribe(this.socket);

    return new Promise((resolve, reject) => {
      this.eventBus.on(WSTransportEvents.Connected, () => resolve());
      this.eventBus.on(WSTransportEvents.Error, (reject));
    });
  }

  public send(data: any): void {
    if (!this.socket) {
      throw new Error('Socket is not connected');
    }

    this.socket.send(JSON.stringify(data));
  }

  public on(event: string, callback: (data?: any) => void) {
    this.eventBus.on(event, callback);
  }

  public close(): void {
    this.socket?.close();
  }

  private subscribe(socket: WebSocket) {
    socket.addEventListener('open', () => {
      this.eventBus.emit(WSTransportEvents.Connected);
      this.setupPing();
    });

    socket.addEventListener('close', (event) => {
      this.eventBus.emit(WSTransportEvents.Close, event);
      this.stopPing();
    });

    socket.addEventListener('error', (event) => {
      this.eventBus.emit(WSTransportEvents.Error, event);
    });

    socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(message.data);
        // Игнорируем технические сообщения типа 'pong'
        if (data.type === 'pong') {
          return;
        }
        this.eventBus.emit(WSTransportEvents.Message, data);
      } catch (e) {
        console.error('WS Message parsing error', e);
      }
    });
  }

  private setupPing() {
    this.intervalId = setInterval(() => {
      this.send({ type: 'ping' });
    }, this.pingInterval);
  }

  private stopPing() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
