import { System } from "../core/System";
import { Entity } from "../core/Entity";
import { getHeroWorldPositionFromGrid } from "../utils/GridUtils.ts";
import { easeOutQuad, moveTowards } from "../utils/MathUtils.ts";
import { GameConstants } from "../constants/GameConstants.ts";
import { hasMoveInput } from "../utils/InputUtils.ts";

export class GridMovementSystem extends System {
  private readonly entities: Entity[];

  constructor(
    entities: Entity[],
    private readonly gridOffsetX: number,
    private readonly gridOffsetY: number,
  ) {
    super();
    this.entities = entities;
  }

  update(delta: number): void {
    for (const entity of this.entities) {
      const gridPos = entity.getComponent("GridPosition");
      const moveTarget = entity.getComponent("MoveTarget");
      const pixelPos = entity.getComponent("Position");
      const input = entity.getComponent("Input");
      const facing = entity.getComponent("Facing");
      const actionState = entity.getComponent("ActionState");

      if (
        !gridPos ||
        !moveTarget ||
        !pixelPos ||
        !input ||
        !facing ||
        !actionState
      )
        continue;

      if (!moveTarget.moving) {
        if (hasMoveInput(input)) {
          // Only accept input if not currently moving
          let targetX = gridPos.tileX;
          let targetY = gridPos.tileY;

          if (input.left) {
            targetX--;
            facing.direction = "left";
          } else if (input.right) {
            targetX++;
            facing.direction = "right";
          } else if (input.up) {
            targetY--;
          } else if (input.down) {
            targetY++;
          }

          moveTarget.x = targetX;
          moveTarget.y = targetY;
          moveTarget.moving = true;
        }
      } else {
        // Moving towards target tile
        const targetPos = getHeroWorldPositionFromGrid(
          moveTarget.x,
          moveTarget.y,
          this.gridOffsetX,
          this.gridOffsetY,
        );

        const moveSpeed = GameConstants.HERO_SPEED
        const baseMoveStep = (moveSpeed / 60) * delta;

        const dx = targetPos.x - pixelPos.x;
        const dy = targetPos.y - pixelPos.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const t = Math.min(1 - distance / GameConstants.TILE_SIZE, 1);
        const easeT = easeOutQuad(t);
        const moveStep = baseMoveStep * (0.5 + 0.5 * easeT);

        if (distance < moveStep) {
          // Reached target tile center

          pixelPos.x = targetPos.x;
          pixelPos.y = targetPos.y;

          gridPos.tileX = moveTarget.x;
          gridPos.tileY = moveTarget.y;

          moveTarget.moving = false;

          // Clear input after move finished
          input.left = false;
          input.right = false;
          input.up = false;
          input.down = false;
        } else {
          // Continue moving towards target
          pixelPos.x = moveTowards(pixelPos.x, targetPos.x, moveStep);
          pixelPos.y = moveTowards(pixelPos.y, targetPos.y, moveStep);
        }
      }
    }
  }
}
