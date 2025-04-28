import { TileType } from "../types/TileType.ts";

export const TileColors: Record<TileType, number> = {
  empty: 0xcccccc,
  wall: 0x333333,
  goal: 0x0000ff,
  energy: 0x31baff,
  hazard: 0xff0000,
  enemy: 0xffb91b,
};
