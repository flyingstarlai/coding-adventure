import { Assets } from "pixi.js";
import { AssetAlias } from "./AssetAlias.ts";

export class AssetManager {
  private static assetsLoaded = false;

  static async loadAll(): Promise<void> {
    if (this.assetsLoaded) {
      return;
    }

    await Assets.load([
      { alias: AssetAlias.UICommandUp, src: "/assets/ui/command-up.png" },
      { alias: AssetAlias.UICommandEvent, src: "/assets/ui/command-event.png" },
      { alias: AssetAlias.UIControlPlay, src: "/assets/ui/control-play.png" },
      { alias: AssetAlias.Background, src: "/assets/background.png" },
      { alias: AssetAlias.HeroSkeleton, src: "/assets/chars/hero-ess.skel" },
      { alias: AssetAlias.HeroAtlas, src: "/assets/chars/hero-ess.atlas" },
    ]);

    this.assetsLoaded = true;
  }

  static get<T>(alias: AssetAlias): T {
    const asset = Assets.get(alias);
    if (!asset) {
      throw new Error(`Asset with alias "${alias}" not found.`);
    }
    return asset as T;
  }

  static async unload(alias: AssetAlias): Promise<void> {
    await Assets.unload(alias);
  }

  static async reload(alias: AssetAlias): Promise<unknown> {
    const asset = Assets.get(alias);
    if (asset) {
      await Assets.unload(alias);
    }
    return Assets.load(alias);
  }
}
