import { LevelManager } from "../managers/LevelManager.ts";
import { CommandType } from "../types/CommandType.ts";
import { GridPosition } from "../components/GridPosition.ts";

/**
 * Check if hero can move into tile (x, y).
 */
export function canMoveToTile(x: number, y: number): boolean {
  const tileType = LevelManager.getTileType(x, y);

  // Out of bounds = not movable
  if (tileType === null) {
    return false;
  }

  // Only empty, energy, goal are walkable
  return tileType === "empty" || tileType === "energy" || tileType === "goal";
}

export function canMoveCommand(
  gridPos: GridPosition,
  command: CommandType,
): boolean {
  let targetX = gridPos.tileX;
  let targetY = gridPos.tileY;

  switch (command) {
    case "left":
      targetX--;
      break;
    case "right":
      targetX++;
      break;
    case "up":
      targetY--;
      break;
    case "down":
      targetY++;
      break;
  }

  return canMoveToTile(targetX, targetY);
}
