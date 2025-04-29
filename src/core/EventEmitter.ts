export type EventMap = {
  PlayStart: void;
  PlayEnd: void;
  LevelCompleted: void;
  LevelFailed: void;
  EnergyCollected: { amount: number };
};

type EventKey = keyof EventMap;
type EventReceiver<K extends EventKey> = (payload: EventMap[K]) => void;

export class EventEmitter {
  private events: Partial<{ [K in EventKey]: EventReceiver<K>[] }> = {};

  on<K extends EventKey>(event: K, callback: EventReceiver<K>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    (this.events[event] as EventReceiver<K>[]).push(callback);
  }

  off<K extends EventKey>(event: K, callback: EventReceiver<K>): void {
    const listeners = this.events[event];
    if (!listeners) return;
    this.events[event] = listeners.filter(cb => cb !== callback) as typeof listeners;
  }

  emit<K extends EventKey>(event: K, payload: EventMap[K]): void {
    const listeners = this.events[event];
    if (!listeners) return;
    for (const cb of listeners) {
      cb(payload);
    }
  }
}
