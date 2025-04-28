import { System } from "../core/System";
import { Entity } from "../core/Entity";
import { HeroAnimationName } from "../entities/hero/HeroAnimatioName.ts";

export class HeroAnimationSystem extends System {
  private readonly entities: Entity[];

  constructor(entities: Entity[]) {
    super();
    this.entities = entities;
  }

  update(_delta: number): void {
    for (const entity of this.entities) {
      const actionState = entity.getComponent("ActionState");
      const animationState = entity.getComponent("AnimationState");
      const spineComponent = entity.getComponent("SpineComponent");

      if (!actionState || !animationState || !spineComponent) continue;

      // Play idle once if Spine has no animation playing
      const currentTrack = spineComponent.spine.state.getCurrent(0);
      if (!currentTrack) {
        spineComponent.spine.state.setAnimation(
          0,
          animationState.current,
          animationState.loop,
        ).timeScale = animationState.timeScale;
      }

      let targetAnimation: HeroAnimationName = "idle";
      let loop = true;
      let timeScale = 1;

      if (actionState.crouch) {
        targetAnimation = "crouch";
        loop = true;
        timeScale = 0.5;
      } else if (actionState.attack) {
        targetAnimation = "attack";
        loop = false;
        timeScale = 0.5;
      } else if (actionState.walk) {
        targetAnimation = "walk";
        loop = true;
        timeScale = 0.5;
      } else {
        targetAnimation = "idle";
        loop = true;
        timeScale = 0.5;
      }

      if (animationState.current !== targetAnimation) {
        spineComponent.spine.state.setAnimation(
          0,
          targetAnimation,
          loop,
        ).timeScale = timeScale;

        // Update AnimationStateComponent
        animationState.current = targetAnimation;
        animationState.loop = loop;
        animationState.timeScale = timeScale;
      }
    }
  }
}
