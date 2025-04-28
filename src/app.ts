import { Application } from "pixi.js";
import { PreloadScene } from "./scenes/PreloadScene.ts";
import { SceneManager } from "./managers/SceneManager.ts";

export class App {
  public pixiApp!: Application;

  public async start() {
    this.pixiApp = new Application();

    await this.pixiApp.init({
      background: "#1099bb",
      resizeTo: window,
    });

    document.getElementById("pixi-container")!.appendChild(this.pixiApp.canvas);

    SceneManager.init(this.pixiApp);

    // Start with PreloadScene
    await SceneManager.changeScene(new PreloadScene(this.pixiApp));

    // Setup Ticker
    this.pixiApp.ticker.add((ticker) => {
      SceneManager.update(ticker.deltaTime);
    });
  }
}
