import { LevelData } from "../types/LevelData.ts";
import { TileType } from "../types/TileType.ts";

export class LevelManager {
  private static levels: LevelData[] = [
    {
      id: 1,
      spawnTileX: 0,
      spawnTileY: 4,
      goalX: 3,
      goalY: 2,
      tileMap: [
        [
          "empty",
          "empty",
          "wall",
          "empty",
          "empty",
          "energy",
          "empty",
          "empty",
        ],
        ["wall", "wall", "wall", "empty", "wall", "wall", "empty", "empty"],
        ["empty", "hazard", "empty", "goal", "wall", "empty", "empty", "empty"],
        ["energy", "wall", "wall", "empty", "empty", "wall", "wall", "energy"],
        [
          "empty",
          "empty",
          "empty",
          "empty",
          "empty",
          "enemy",
          "empty",
          "empty",
        ],
      ],
      answerPath: [
        "right",
        "right",
        "right",
        "up",
        "right",
        "up",
        "right",
        "right",
        "up",
        "right",
        "up",
      ],
    },
  ];

  private static currentLevelIndex = 0;

  static getCurrentLevel(): LevelData {
    return this.levels[this.currentLevelIndex];
  }

  static setLevelById(id: number): void {
    const index = this.levels.findIndex((lvl) => lvl.id === id);
    if (index !== -1) {
      this.currentLevelIndex = index;
    } else {
      console.warn(`Level with id ${id} not found, fallback to level 1.`);
      this.currentLevelIndex = 0;
    }
  }

  static nextLevel(): number {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
    }
    return this.currentLevelIndex + 1;
  }

  static reset(): void {
    this.currentLevelIndex = 0;
  }

  static getTileType(x: number, y: number): TileType | null {
    const level = this.getCurrentLevel();
    if (
      x < 0 ||
      y < 0 ||
      x >= level.tileMap[0].length ||
      y >= level.tileMap.length
    ) {
      return null; // Out of bounds
    }
    return level.tileMap[y][x];
  }
}
