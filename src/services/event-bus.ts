import type { EventsTypes, Callback, ComponentProps } from './types';

export class EventBus {
  private readonly events: EventsTypes;

  constructor() {
    this.events = {};
  }

  on(event: string, callback: Callback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  off(event: string, callback: Callback): void {
    if (!this.events[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.events[event] = this.events[event].filter(
      (existingCallback: Callback) => existingCallback !== callback,
    );
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.events[event] || this.events[event].length === 0) {
      return;
    }

    this.events[event].forEach((callback: Callback) => {
      callback(...args as ComponentProps[]);
    });
  }
}
