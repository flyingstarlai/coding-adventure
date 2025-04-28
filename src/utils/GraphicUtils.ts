import { Graphics, Container } from "pixi.js";
import { GameConstants } from "../constants/GameConstants.ts";

export function createTrapHole(
  x: number,
  y: number,
  tileSize: number,
): Container {
  const hole = new Graphics();
  hole.circle(0, 0, tileSize * 0.4);
  hole.fill(0x828397);

  hole.circle(0, 0, tileSize * 0.4 * 0.75);
  hole.fill(0x000000);

  hole.x = x;
  hole.y = y - tileSize * 0.5 + GameConstants.GROUND_OFFSET;

  return hole;
}
