import { Graphics, Container, Text } from "pixi.js";
import { GameConstants } from "../constants/GameConstants.ts";
import { LevelData } from "../types/LevelData.ts";
import { TileColors } from "../constants/TileColor.ts";

export function createGrid(
  screenWidth: number,
  screenHeight: number,
  level: LevelData,
): Container {
  const container = new Container();

  const tileSize = GameConstants.TILE_SIZE;
  const gridWidth = GameConstants.GRID_WIDTH;
  const gridHeight = GameConstants.GRID_HEIGHT;

  // === 1. Draw tiles color first ===
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const tileType = level.tileMap[y][x];

      let color: number;

      if (x === level.spawnTileX && y === level.spawnTileY) {
        color = 0x00c800;
      } else {
        color = TileColors[tileType] ?? 0xffffff; // Default white
      }

      const tile = new Graphics();
      tile.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      tile.fill({ color, alpha: 0.7 });

      container.addChild(tile);

      if (tileType !== "empty") {
        let labelText = "";

        switch (tileType) {
          case "goal":
            labelText = "Goal";
            break;
          case "wall":
            labelText = "Cliff";
            break;
          case "energy":
            labelText = "Energy";
            break;
          case "hazard":
            labelText = "Hazard";
            break;
          case "enemy":
            labelText = "Enemy";
            break;
        }

        if (labelText) {
          const label = new Text({
            text: labelText,
            style: {
              fontFamily: "Arial",
              fontSize: 20,
              fill: 0xffffff,
              align: "center",
            },
          });
          label.anchor.set(0.5);
          label.x = x * tileSize + tileSize / 2;
          label.y = y * tileSize + tileSize / 2;
          container.addChild(label);
        }
      }
    }
  }

  // === 2. Draw grid lines over tiles ===
  const gridLines = new Graphics();
  gridLines.beginPath();

  // Vertical lines
  for (let x = 0; x <= gridWidth; x++) {
    const posX = x * tileSize;
    gridLines.moveTo(posX, 0);
    gridLines.lineTo(posX, gridHeight * tileSize);
  }

  // Horizontal lines
  for (let y = 0; y <= gridHeight; y++) {
    const posY = y * tileSize;
    gridLines.moveTo(0, posY);
    gridLines.lineTo(gridWidth * tileSize, posY);
  }

  // Apply stroke style
  gridLines.stroke({
    color: 0xffffff, // White
    alpha: 0.3, // 30% opacity
    width: 1, // 1px line
  });

  container.addChild(gridLines);

  // === 3. Centering container ===
  container.x = (screenWidth - GameConstants.GRID_PIXEL_WIDTH) / 2;
  container.y =
    (screenHeight - GameConstants.GRID_PIXEL_HEIGHT - GameConstants.UI_HEIGHT) /
    2;

  return container;
}

export function getWorldPositionFromGrid(
  tileX: number,
  tileY: number,
  gridOffsetX: number,
  gridOffsetY: number,
): { x: number; y: number } {
  return {
    x:
      gridOffsetX +
      tileX * GameConstants.TILE_SIZE +
      GameConstants.TILE_SIZE / 2,
    y: gridOffsetY + tileY * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE,
  };
}

export function getHeroWorldPositionFromGrid(
  tileX: number,
  tileY: number,
  gridOffsetX: number,
  gridOffsetY: number,
): { x: number; y: number } {
  const position = getWorldPositionFromGrid(
    tileX,
    tileY,
    gridOffsetX,
    gridOffsetY,
  );
  return {
    x: position.x,
    y: position.y - GameConstants.GROUND_OFFSET,
  };
}
