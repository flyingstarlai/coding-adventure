import { EventBus } from "../core/EventBus.ts";

export const GameEventManager = {
  HighlightCommand: {
    subscribe(callback: (currentIndex: number) => void) {
      EventBus.on("HighlightCommand", callback);
    },
    unsubscribe(callback: (currentIndex: number) => void) {
      EventBus.off("HighlightCommand", callback);
    },
    emit(currentIndex: number) {
      EventBus.emit("HighlightCommand", currentIndex);
    },
  },
  ResetHighlightCommand: {
    subscribe(callback: () => void) {
      EventBus.on("ResetHighlightCommand", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("ResetHighlightCommand", callback);
    },
    emit() {
      EventBus.emit("ResetHighlightCommand", undefined);
    },
  },
  LevelCompleted: {
    subscribe(callback: () => void) {
      EventBus.on("LevelCompleted", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("LevelCompleted", callback);
    },
    emit() {
      EventBus.emit("LevelCompleted", undefined);
    },
  },

  LevelFailed: {
    subscribe(callback: () => void) {
      EventBus.on("LevelFailed", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("LevelFailed", callback);
    },
    emit() {
      EventBus.emit("LevelFailed", undefined);
    },
  },

  EnergyCollected: {
    subscribe(callback: (amount: number) => void) {
      EventBus.on("EnergyCollected", callback);
    },
    unsubscribe(callback: (amount: number) => void) {
      EventBus.off("EnergyCollected", callback);
    },
    emit(amount: number) {
      EventBus.emit("EnergyCollected", amount);
    },
  },
};
