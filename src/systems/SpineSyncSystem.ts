import { System } from "../core/System";
import { Entity } from "../core/Entity";

export class SpineSyncSystem extends System {
  private readonly entities: Entity[];

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
  }

  update(_delta: number): void {
    for (const entity of this.entities) {
      const position = entity.getComponent("Position");
      const spineComponent = entity.getComponent("SpineComponent");
      const facing = entity.getComponent("Facing");

      if (!position || !spineComponent || !facing) continue;

      // Sync the Position to Spine Sprite
      spineComponent.spine.x = position.x;
      spineComponent.spine.y = position.y;

      if (facing) {
        if (facing.direction === "right") {
          spineComponent.spine.scale.x = Math.abs(spineComponent.spine.scale.x);
        } else if (facing.direction === "left") {
          spineComponent.spine.scale.x = -Math.abs(
            spineComponent.spine.scale.x,
          );
        }
      }
    }
  }
}
