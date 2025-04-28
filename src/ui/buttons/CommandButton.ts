import { Container, Sprite, Texture } from "pixi.js";
import { CommandType } from "../../types/CommandType.ts";

export class CommandButton extends Container {
  public sprite: Sprite;
  public readonly commandType: CommandType;

  constructor(texture: Texture, commandType: CommandType) {
    super();

    this.commandType = commandType;

    // Create sprite
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";

    switch (commandType) {
      case "left":
        this.sprite.rotation = -Math.PI / 2;
        break;
      case "right":
        this.sprite.rotation = Math.PI / 2;
        break;
      case "up":
        this.sprite.rotation = 0;
        break;
      case "down":
        this.sprite.rotation = Math.PI;
        break;
    }

    this.addChild(this.sprite);
  }

  cloneForQueue(): CommandButton {
    // Create a new instance for queue
    const cloned = new CommandButton(this.sprite.texture, this.commandType);
    cloned.scale.set(1);
    return cloned;
  }

  highlight(): void {
    this.sprite.tint = 0x66ff66;
    this.sprite.scale.set(1.1);
  }

  unhighlight(): void {
    this.sprite.tint = 0xffffff; // Normal
    this.sprite.scale.set(1);
  }
}
