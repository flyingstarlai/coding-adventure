import { EventEmitter } from "./EventEmitter.ts";
import { GameEvents } from "../events/GameEvents.ts";
import { UIEvents } from "../events/UIEvents.ts";

export type AllEvents = GameEvents & UIEvents;

export const EventBus = new EventEmitter<AllEvents>();
