import { System } from "../core/System";
import { Entity } from "../core/Entity";

export class RenderSystem extends System {
  private readonly entities: Entity[];

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
  }

  update(): void {
    for (const entity of this.entities) {
      const position = entity.getComponent("Position");
      const spriteRenderer = entity.getComponent("SpriteRenderer");

      if (position && spriteRenderer) {
        spriteRenderer.sprite.x = position.x;
        spriteRenderer.sprite.y = position.y;
      }
    }
  }
}
