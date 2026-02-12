import {
  describe, expect, jest, beforeEach, it,
} from '@jest/globals';
import { EventBus } from './event-bus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  it('должен регистрировать обработчик и вызывать его при emit', () => {
    const mockCallback = jest.fn();
    eventBus.on('test-event', mockCallback);
    eventBus.emit('test-event', 'arg1', 123);

    expect(mockCallback).toHaveBeenCalledWith('arg1', 123);
  });

  it('должен удалять конкретный обработчик через off', () => {
    const mockCallback = jest.fn();
    eventBus.on('test-event', mockCallback);
    eventBus.off('test-event', mockCallback);
    eventBus.emit('test-event');

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('должен выбрасывать ошибку в off, если событие не существует', () => {
    expect(() => {
      eventBus.off('non-existent', () => {});
    }).toThrow('Нет события: non-existent');
  });

  it('метод emit не должен ничего делать, если события нет или список обработчиков пуст', () => {
    expect(() => eventBus.emit('no-event')).not.toThrow();

    const cb = jest.fn();
    eventBus.on('empty-event', cb);
    eventBus.off('empty-event', cb);
    eventBus.emit('empty-event');

    expect(cb).not.toHaveBeenCalled();
  });
});
