import { Application, Container } from "pixi.js";

export interface Scene {
  container: Container;
  init(): Promise<void> | void;
  update?(delta: number): void;
  destroy?(): void;
}

export class SceneManager {
  private static app: Application;
  private static currentScene: Scene;

  public static init(app: Application) {
    this.app = app;
  }

  public static async changeScene(newScene: Scene) {
    if (this.currentScene) {
      if (this.currentScene.destroy) {
        this.currentScene.destroy();
      }
      this.app.stage.removeChild(this.currentScene.container);
    }

    this.currentScene = newScene;

    await this.currentScene.init();
    this.app.stage.addChild(this.currentScene.container);
  }

  public static update(delta: number): void {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(delta);
    }
  }
}
