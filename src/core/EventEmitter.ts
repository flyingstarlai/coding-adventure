type EventReceiver<T> = (payload: T) => void;

export class EventEmitter<EventMap extends Record<string, any>> {
  private events: {
    [K in keyof EventMap]?: EventReceiver<EventMap[K]>[];
  } = {};

  on<K extends keyof EventMap>(
    event: K,
    callback: EventReceiver<EventMap[K]>,
  ): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(callback);
  }

  off<K extends keyof EventMap>(
    event: K,
    callback: EventReceiver<EventMap[K]>,
  ): void {
    const listeners = this.events[event];
    if (listeners) {
      this.events[event] = listeners.filter(
        (cb) => cb !== callback,
      ) as EventReceiver<EventMap[K]>[];
    }
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach((callback) => {
        callback(payload);
      });
    }
  }

  removeAllListeners<K extends keyof EventMap>(event: K): void {
    if (this.events[event]) {
      delete this.events[event];
    }
  }
}
