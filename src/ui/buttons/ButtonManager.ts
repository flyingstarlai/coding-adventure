import { Container } from "pixi.js";
import { ButtonSprite } from "./ButtonSprite.ts";

interface ButtonConfig {
  texture: string;
  onPress: () => void;
  x: number;
  y: number;
  rotation?: number;
}

export class ButtonManager {
  public container: Container;

  constructor() {
    this.container = new Container();
  }

  createButton(config: ButtonConfig): ButtonSprite {
    const sprite = new ButtonSprite(config.texture);
    sprite.anchor.set(0.5);
    sprite.x = config.x;
    sprite.y = config.y;

    sprite.rotation = config.rotation ?? 0;
    sprite.scale.set(0.6);

    sprite.on("pointerdown", () => {
      sprite.scale.set(0.5);
    });

    sprite.on("pointerup", () => {
      sprite.scale.set(0.6);
      config.onPress();
    });

    this.container.addChild(sprite);

    return sprite;
  }
}
