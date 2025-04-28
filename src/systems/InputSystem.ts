import { System } from "../core/System";
import { Entity } from "../core/Entity";

export class InputSystem extends System {
  private readonly entities: Entity[];

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
  }

  update(_delta: number): void {
    for (const entity of this.entities) {
      const input = entity.getComponent("Input");
      const actionState = entity.getComponent("ActionState");

      if (input && actionState) {
        // Update Hero state
        actionState.walk = input.left || input.right || input.up || input.down;
        actionState.idle = !actionState.walk && !actionState.attack;
        actionState.attack = input.attack;
      }
    }
  }
}
