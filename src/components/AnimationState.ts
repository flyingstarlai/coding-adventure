import { HeroAnimationName } from "../entities/hero/HeroAnimatioName.ts";

export interface AnimationState {
  current: HeroAnimationName;
  loop: boolean;
  timeScale: number;
}
