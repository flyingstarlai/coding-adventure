import { System } from "../core/System";
import { Entity } from "../core/Entity";

export class SpineSystem extends System {
  private readonly entities: Entity[];

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
  }

  update(delta: number): void {
    for (const entity of this.entities) {
      const spineComp = entity.getComponent("SpineComponent");
      if (spineComp) {
        spineComp.spine.update(delta / 60);
      }
    }
  }
}
