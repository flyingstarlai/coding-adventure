import { Sprite, Texture } from "pixi.js";

export class ButtonSprite extends Sprite {
  private enabled = true;

  constructor(texture: string | Texture) {
    super(typeof texture === "string" ? Sprite.from(texture).texture : texture);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.alpha = enabled ? 1 : 0.5;
    this.cursor = enabled ? "pointer" : "default";
    this.eventMode = enabled ? "static" : "none";
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
