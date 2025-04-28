import { TileType } from "./TileType.ts";
import { CommandType } from "./CommandType.ts";

export interface LevelData {
  id: number;
  spawnTileX: number;
  spawnTileY: number;
  goalX: number;
  goalY: number;
  tileMap: TileType[][];
  answerPath: CommandType[];
}
