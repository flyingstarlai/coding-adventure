import { Container, Sprite } from "pixi.js";

export interface ButtonGroupConfig {
  buttons: Sprite[];
  centerX: number;
  centerY: number;
  spacing: number;
}

export class ButtonGroupManager {
  public container: Container;

  constructor() {
    this.container = new Container();
  }

  createButtonGroup(config: ButtonGroupConfig): void {
    const { buttons, centerX, centerY, spacing } = config;

    if (buttons.length === 0) return;

    const buttonWidth = buttons[0].width;
    const totalWidth =
      buttonWidth * buttons.length + spacing * (buttons.length - 1);

    const startX = centerX - totalWidth / 2;

    buttons.forEach((btn, index) => {
      btn.x = startX + index * (buttonWidth + spacing) + buttonWidth / 2;
      btn.y = centerY;
      this.container.addChild(btn);
    });
  }
}
