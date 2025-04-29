import { EventBus } from "../core/EventBus.ts";

export const UIEventManager = {
  PlayButton: {
    subscribe(callback: () => void) {
      EventBus.on("PlayButtonPressed", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("PlayButtonPressed", callback);
    },
    emit() {
      EventBus.emit("PlayButtonPressed", undefined);
    },
  },

  StopButton: {
    subscribe(callback: () => void) {
      EventBus.on("StopButtonPressed", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("StopButtonPressed", callback);
    },
    emit() {
      EventBus.emit("StopButtonPressed", undefined);
    },
  },

  ContinueButton: {
    subscribe(callback: () => void) {
      EventBus.on("ContinueButtonPressed", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("ContinueButtonPressed", callback);
    },
    emit() {
      EventBus.emit("ContinueButtonPressed", undefined);
    },
  },

  RetryButton: {
    subscribe(callback: () => void) {
      EventBus.on("RetryButtonPressed", callback);
    },
    unsubscribe(callback: () => void) {
      EventBus.off("RetryButtonPressed", callback);
    },
    emit() {
      EventBus.emit("RetryButtonPressed", undefined);
    },
  },
};
