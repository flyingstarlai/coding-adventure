import { Entity } from "../core/Entity.ts";
import { CommandQueueManager } from "../managers/CommandQueueManager.ts";
import { CommandType } from "../types/CommandType.ts";
import { System } from "../core/System.ts";
import { canMoveCommand } from "../utils/CollisionUtils.ts";
import { LevelResultPopup } from "../ui/popup/LevelResultPopup.ts";
import { LevelManager } from "../managers/LevelManager.ts";

export class CommandRunnerSystem extends System {
  private readonly entities: Entity[];
  private queueManager: CommandQueueManager;
  private commands: CommandType[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private hasStarted = false;
  private waitingForMove = false;
  private levelResultPopup: LevelResultPopup;

  public onPlayStart?: () => void;
  public onPlayEnd?: () => void;

  constructor(
    entities: Entity[],
    queueManager: CommandQueueManager,
    levelResultPopup: LevelResultPopup,
  ) {
    super();
    this.entities = entities;
    this.queueManager = queueManager;
    this.levelResultPopup = levelResultPopup;
  }
  start(): void {
    this.commands = [...this.queueManager.getCommands()];

    console.log("CommandRunnerSystem started", this.commands);
    this.currentIndex = 0;
    this.isPlaying = true;
    this.hasStarted = true;
    this.waitingForMove = false;

    this.onPlayStart?.();
  }

  stop() {
    console.log("CommandRunnerSystem stopped", this.commands);
  }

  update(_delta: number): void {
    if (!this.isPlaying) return;

    for (const entity of this.entities) {
      const moveTarget = entity.getComponent("MoveTarget");
      const input = entity.getComponent("Input");
      const gridPos = entity.getComponent("GridPosition");

      if (!moveTarget || !input || !gridPos) return;

      if (moveTarget.moving) {
        this.waitingForMove = true;
        return;
      }

      if (this.waitingForMove) {
        this.waitingForMove = false;
        this.currentIndex++;
      }

      // All commands executed
      if (this.currentIndex >= this.commands.length) {
        this.isPlaying = false;

        this.queueManager.resetAllButtonHighlights();

        const level = LevelManager.getCurrentLevel();
        console.log(`Compare ${gridPos.tileY} : ${level.goalY}`);
        if (gridPos.tileX === level.goalX && gridPos.tileY === level.goalY) {
          console.log("🎉 Congratulation! Level Complete!");
          setTimeout(() => {
            this.levelResultPopup.showWin();
          }, 1000);
        } else {
          console.error("❌ Level Failed!");
          this.triggerHeroDeath(entity);
          setTimeout(() => {
            this.levelResultPopup.showLose();
          }, 1000);
        }
        return;
      }

      // === Execute next command
      const command = this.commands[this.currentIndex];

      if (!canMoveCommand(gridPos, command)) {
        console.log(`Cannot move ${command}, skipping`);
        this.currentIndex += this.commands.length; // Make it stop
        return;
      }

      this.queueManager.highlightButtonAt(this.currentIndex);

      switch (command) {
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
    }
  }

  private triggerHeroDeath(entity: Entity): void {
    const actionState = entity.getComponent("ActionState");
    const input = entity.getComponent("Input");

    if (actionState && input) {
      actionState.crouch = true;
    }
  }

  reset(): void {
    this.isPlaying = false;
    this.hasStarted = false;
    this.currentIndex = 0;
    this.waitingForMove = false;

    this.onPlayEnd?.();
  }

  public isGameOver(): boolean {
    return this.hasStarted && !this.isPlaying;
  }
}
