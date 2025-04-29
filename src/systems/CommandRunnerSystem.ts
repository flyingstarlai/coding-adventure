import { Entity } from "../core/Entity.ts";
import { System } from "../core/System.ts";
import { canMoveCommand } from "../utils/CollisionUtils.ts";
import { LevelManager } from "../managers/LevelManager.ts";
import { GameEventManager } from "../managers/GameEventManager.ts";
import { CommandStateSO } from "../states/CommandStateSO.ts";
import { GridPosition } from "../components/GridPosition.ts";
import { UIEventManager } from "../managers/UIEventManager.ts";

export class CommandRunnerSystem extends System {
  private readonly entities: Entity[];
  private isPlaying = false;
  private pendingForCommand = false;
  private commandState: CommandStateSO;

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
    this.commandState = CommandStateSO.getInstance();
  }
  start(): void {
    this.isPlaying = true;
    this.pendingForCommand = false;
    this.commandState.reset();

    console.log(`Start with ${this.commandState.getCommands()}`);
  }

  stop() {
    console.log("CommandRunnerSystem stopped", this.commandState.getCommands());
    UIEventManager.RetryButton.emit();
    GameEventManager.ResetHighlightCommand.emit();
  }

  reset(): void {
    this.isPlaying = false;
    this.pendingForCommand = false;
    this.commandState.reset();
  }

  update(_delta: number): void {
    if (!this.isPlaying) return;

    for (const entity of this.entities) {
      const moveTarget = entity.getComponent("MoveTarget");
      const input = entity.getComponent("Input");
      const gridPos = entity.getComponent("GridPosition");

      if (!moveTarget || !input || !gridPos) return;

      // === CASE 1: Hero still moving
      if (moveTarget.moving) {
        console.log("target is moving");
        return;
      }

      // === CASE 2: Hero finished moving
      if (!this.pendingForCommand) {
        this.pendingForCommand = true;
      }

      // === CASE 3: Send next command if pending
      if (this.pendingForCommand) {
        if (this.commandState.isDone()) {
          this.finish(entity, gridPos);
          return;
        }

        const currentCommand = this.commandState.getCurrentCommand();
        console.log(
          "current command index",
          this.commandState.getCurrentIndex(),
        );

        // Check collision
        if (!canMoveCommand(gridPos, currentCommand)) {
          console.log(`❌ Cannot move ${currentCommand}, force stop`);
          this.commandState.forceDone();
          this.finish(entity, gridPos);
          return;
        }

        // Highlight
        GameEventManager.HighlightCommand.emit(
          this.commandState.getCurrentIndex(),
        );

        // Send input
        switch (currentCommand) {
          case "left":
            input.left = true;
            break;
          case "right":
            input.right = true;
            break;
          case "up":
            input.up = true;
            break;
          case "down":
            input.down = true;
            break;
        }

        this.pendingForCommand = false;
        this.commandState.advance();
      }
    }
  }

  private triggerHeroDeath(entity: Entity): void {
    const actionState = entity.getComponent("ActionState");
    const input = entity.getComponent("Input");

    if (actionState && input) {
      actionState.crouch = true;
    }
  }

  private finish(entity: Entity, gridPos: GridPosition) {
    this.isPlaying = false;
    GameEventManager.ResetHighlightCommand.emit();

    const level = LevelManager.getCurrentLevel();
    if (gridPos.tileX === level.goalX && gridPos.tileY === level.goalY) {
      setTimeout(() => {
        GameEventManager.LevelCompleted.emit();
      }, 300);
    } else {
      this.triggerHeroDeath(entity);
      setTimeout(() => {
        GameEventManager.LevelFailed.emit();
      }, 300);
    }
  }
}
