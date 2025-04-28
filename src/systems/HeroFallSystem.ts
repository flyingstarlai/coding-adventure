import { System } from "../core/System";
import { Entity } from "../core/Entity";
import { GameConstants } from "../constants/GameConstants";

export class HeroFallSystem extends System {
  private readonly entities: Entity[];

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
  }

  update(delta: number): void {
    for (const entity of this.entities) {
      const fallState = entity.getComponent("FallState");
      const spineComponent = entity.getComponent("SpineComponent");

      if (!fallState || !spineComponent) continue;
      if (!fallState.falling) continue;

      fallState.elapsed += delta / 60;
      const t = Math.min(fallState.elapsed / fallState.duration, 1);

      const spine = spineComponent.spine;

      spine.y += (GameConstants.TILE_SIZE / 2) * (delta / 60);
      spine.scale.set(GameConstants.HERO_SCALE - 0.3 * t);
      // Fade out
      spine.alpha = 1 - t;

      if (t >= 1) {
        fallState.falling = false;
      }
    }
  }
}
