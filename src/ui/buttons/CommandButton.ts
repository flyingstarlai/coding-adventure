import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { CommandType } from "../../types/CommandType.ts";

export class CommandButton extends Container {
  public sprite: Sprite;
  public readonly commandType: CommandType;
  private highlightStroke: Graphics;

  constructor(texture: Texture, commandType: CommandType) {
    super();

    this.commandType = commandType;

    // Create sprite
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.interactive = true;
    this.sprite.cursor = "pointer";

    this.highlightStroke = new Graphics();
    this.highlightStroke.visible = false;
    this.addChild(this.highlightStroke);

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
    this.sprite.tint = 0x7dff7d;
    this.sprite.scale.set(1.1);

    // Draw stroke
    this.highlightStroke.clear();
    this.highlightStroke.setStrokeStyle({ width: 8, color: 0x7dff7d }); // Yellow

    const width = this.sprite.width;
    const height = this.sprite.height;
    const radius = 12; // you can adjust radius value here!

    this.highlightStroke.roundRect(
      -width / 2,
      -height / 2,
      width,
      height,
      radius,
    );
    this.highlightStroke.stroke();
    this.highlightStroke.visible = true;
  }

  unhighlight(): void {
    this.sprite.tint = 0xffffff;
    this.sprite.scale.set(1);

    // Clear stroke
    this.highlightStroke.clear();
    this.highlightStroke.visible = false;
  }
}
