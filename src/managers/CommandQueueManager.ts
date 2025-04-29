import { Container } from "pixi.js";
import { CommandType } from "../types/CommandType";
import { CommandButton } from "../ui/buttons/CommandButton.ts";
import { CommandStateSO } from "../states/CommandStateSO.ts"; // (left, right, up, down)

interface CommandQueueManagerOptions {
  width: number;
  height: number;
  spacing?: number;
}

export class CommandQueueManager {
  public container: Container;
  private commands: CommandType[] = [];
  private commandButtons: CommandButton[] = [];

  private readonly height: number;
  private readonly spacing: number;

  constructor(options: CommandQueueManagerOptions) {
    this.container = new Container();
    this.height = options.height;
    this.spacing = options.spacing ?? 20;
  }

  clearCommands(): void {
    for (const button of this.commandButtons) {
      button.destroy();
    }
    this.commandButtons = [];
    this.commands = [];
  }

  getCommands(): CommandType[] {
    return this.commands;
  }

  relayout(): void {
    let startX = this.spacing;

    for (const button of this.commandButtons) {
      button.x = startX;
      button.y = this.height / 2;
      startX += this.spacing;
    }
  }

  getDragButtonInsertIndex(ghostX: number): number {
    for (let i = 0; i < this.commandButtons.length; i++) {
      const button = this.commandButtons[i];

      if (ghostX < button.x) {
        return i;
      }
    }

    return this.commandButtons.length;
  }

  addExistingCommand(button: CommandButton, index?: number): CommandButton {
    const clone = button.cloneForQueue();
    this.container.addChild(clone);

    if (typeof index === "number") {
      this.commandButtons.splice(index, 0, clone);
      this.commands.splice(index, 0, button.commandType);
    } else {
      this.commandButtons.push(clone);
      this.commands.push(button.commandType);
    }

    CommandStateSO.getInstance().setCommands(this.commands);
    return clone;
  }

  updateLiveShift(ghostX: number): void {
    if (this.commandButtons.length === 0) return;

    const startX = this.spacing;
    const centerY = this.height / 2;

    const insertIndex = this.getDragButtonInsertIndex(ghostX);

    for (let i = 0; i < this.commandButtons.length; i++) {
      const button = this.commandButtons[i];
      let offset = 0;

      if (i >= insertIndex) {
        offset = this.spacing;
      }

      button.x = startX + i * this.spacing + offset;
      button.y = centerY;
    }
  }

  removeCommand(button: CommandButton): void {
    const index = this.commandButtons.indexOf(button);
    if (index !== -1) {
      this.commandButtons.splice(index, 1);
      this.commands.splice(index, 1);
      this.container.removeChild(button);
      this.relayout();
    }
  }

  isButtonInQueue(button: CommandButton): boolean {
    return this.commandButtons.includes(button);
  }

  getCommandButtons(): CommandButton[] {
    return this.commandButtons;
  }
}
