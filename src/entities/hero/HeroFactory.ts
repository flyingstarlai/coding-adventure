import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { AssetAlias } from "../../assets/AssetAlias.ts";
import { GameConstants } from "../../constants/GameConstants.ts";

export enum HeroSkinType {
  Default = "Default",
}

export class HeroFactory {
  static create(skin: HeroSkinType = HeroSkinType.Default): Spine {
    let skeletonAlias: string;
    let atlasAlias: string;

    switch (skin) {
      case HeroSkinType.Default:
      default:
        skeletonAlias = AssetAlias.HeroSkeleton;
        atlasAlias = AssetAlias.HeroAtlas;
        break;
    }

    const spine = Spine.from({
      skeleton: skeletonAlias,
      atlas: atlasAlias,
    });

    spine.scale.set(GameConstants.HERO_SCALE);
    spine.state.data.defaultMix = 0.2;

    return spine;
  }
}
