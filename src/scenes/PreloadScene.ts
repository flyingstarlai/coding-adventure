import { Application, Container, Text } from "pixi.js";
import { Scene } from "../managers/SceneManager";
import { AssetManager } from "../assets/AssetManager.ts";
import { SceneManager } from "../managers/SceneManager";
import { GameScene } from "./GameScene";
import { getLevelFromURL } from "../utils/LevelUtils.ts";
import { LevelManager } from "../managers/LevelManager.ts";

export class PreloadScene implements Scene {
  public container: Container;
  private readonly app: Application;
  private readonly loadingText: Text;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();

    this.loadingText = new Text({
      text: "Loading...",
      style: {
        fontSize: 32,
        fill: 0xffffff,
      },
    });

    this.loadingText.anchor.set(0.5);
    this.loadingText.x = this.app.screen.width / 2;
    this.loadingText.y = this.app.screen.height / 2;

    this.container.addChild(this.loadingText);
  }

  public async init(): Promise<void> {
    await AssetManager.loadAll();

    const levelId = getLevelFromURL();
    LevelManager.setLevelById(levelId);
    await SceneManager.changeScene(new GameScene(this.app));
  }

  public update(_delta: number): void {}

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
