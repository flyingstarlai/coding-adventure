import { Application, Container, Sprite, Texture } from "pixi.js";
import { World } from "../core/World";
import { Entity } from "../core/Entity";
import { Scene } from "../managers/SceneManager";
import { AssetManager } from "../assets/AssetManager.ts";
import { AssetAlias } from "../assets/AssetAlias.ts";
import { SpineSystem } from "../systems/SpineSystem.ts";
import { InputSystem } from "../systems/InputSystem.ts";
import { HeroAnimationSystem } from "../systems/HeroAnimationSystem.ts";
import { HeroFactory, HeroSkinType } from "../entities/hero/HeroFactory.ts";
import { UIScene } from "./UIScene.ts";
import {
  createGrid,
  getHeroWorldPositionFromGrid,
} from "../utils/GridUtils.ts";
import { GridMovementSystem } from "../systems/GridMovementSystem.ts";
import { SpineSyncSystem } from "../systems/SpineSyncSystem.ts";
import { CommandRunnerSystem } from "../systems/CommandRunnerSystem.ts";
import { LevelManager } from "../managers/LevelManager.ts";
import { LevelData } from "../types/LevelData.ts";
import { HeroFallSystem } from "../systems/HeroFallSystem.ts";
import { clearInput } from "../utils/InputUtils.ts";
import { GameConstants } from "../constants/GameConstants.ts";

export class GameScene implements Scene {
  public container: Container;
  private readonly app: Application;
  private world: World;
  private heroEntity!: Entity;
  private uiScene!: UIScene;
  private commandRunner!: CommandRunnerSystem;
  private spawnPos!: { x: number; y: number };
  private level!: LevelData;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.world = new World();
  }

  public init() {
    // === Background ===
    const bgTexture = AssetManager.get<Texture>(AssetAlias.Background);
    const bg = new Sprite(bgTexture);
    bg.width = this.app.screen.width;
    bg.height = this.app.screen.height - GameConstants.UI_HEIGHT;
    this.container.addChild(bg);

    // === Level ===
    this.level = LevelManager.getCurrentLevel();

    // === Grid ===
    const grid = createGrid(
      this.app.screen.width,
      this.app.screen.height,
      this.level,
    );
    this.container.addChild(grid);

    this.spawnPos = getHeroWorldPositionFromGrid(
      this.level.spawnTileX,
      this.level.spawnTileY,
      grid.x,
      grid.y,
    );

    // === UI Scene ===
    this.uiScene = new UIScene(this.app);
    this.container.addChild(this.uiScene.container);

    // === Hero Entity ===
    const entity = new Entity();

    // === Hero Spine Object ===
    const heroSpine = HeroFactory.create(HeroSkinType.Default);
    heroSpine.x = this.spawnPos.x;
    heroSpine.y = this.spawnPos.y;

    entity.addComponent("SpineComponent", {
      spine: heroSpine,
    });

    entity.addComponent("Input", {
      left: false,
      right: false,
      up: false,
      down: false,
      attack: false,
    });

    entity.addComponent("Position", {
      x: this.spawnPos.x,
      y: this.spawnPos.y,
    });

    entity.addComponent("GridPosition", {
      tileX: this.level.spawnTileX,
      tileY: this.level.spawnTileY,
    });

    entity.addComponent("Facing", {
      direction: "right",
    });

    entity.addComponent("MoveTarget", {
      x: this.level.spawnTileX,
      y: this.level.spawnTileY,
      moving: false,
    });

    entity.addComponent("ActionState", {
      idle: true,
      walk: false,
      attack: false,
      crouch: false,
    });
    entity.addComponent("AnimationState", {
      current: "idle",
      loop: true,
      timeScale: 1,
    });

    this.heroEntity = entity;

    this.container.addChild(heroSpine);

    this.world.addSystem(new InputSystem([this.heroEntity]));
    this.world.addSystem(new HeroAnimationSystem([this.heroEntity]));
    this.world.addSystem(new SpineSystem([this.heroEntity]));
    this.world.addSystem(
      new GridMovementSystem([this.heroEntity], grid.x, grid.y),
    );
    this.world.addSystem(new SpineSyncSystem([this.heroEntity]));

    this.uiScene.init(
      () => this.commandRunner.start(),
      () => this.resetLevel(),
    );

    this.commandRunner = new CommandRunnerSystem(
      [this.heroEntity],
      this.uiScene.getCommandQueueManager(),
      this.uiScene.getLevelResultPopup(),
    );

    this.world.addSystem(this.commandRunner);
    this.world.addSystem(new HeroFallSystem([this.heroEntity]));
  }

  public destroy() {
    this.app.ticker.stop();
    this.container.destroy({ children: true });
  }

  update(delta: number) {
    this.world.update(delta);

    if (this.commandRunner.isGameOver()) {
      this.setGameOver(true);
    }
  }

  private resetLevel(): void {
    const gridPosition = this.heroEntity.getComponent("GridPosition");
    const position = this.heroEntity.getComponent("Position");
    const moveTarget = this.heroEntity.getComponent("MoveTarget");
    const actionState = this.heroEntity.getComponent("ActionState");
    const input = this.heroEntity.getComponent("Input");

    if (gridPosition && position && moveTarget && actionState && input) {
      gridPosition.tileX = this.level.spawnTileX;
      gridPosition.tileY = this.level.spawnTileY;

      position.x = this.spawnPos.x;
      position.y = this.spawnPos.y;

      moveTarget.x = this.level.spawnTileX;
      moveTarget.y = this.level.spawnTileY;
      moveTarget.moving = false;

      clearInput(input, actionState);
      this.commandRunner.reset();
      this.setGameOver(false);
    }
  }

  public setGameOver(state: boolean) {
    console.log("setInteractionEnabled", !state);
    this.uiScene.setInteractionEnabled(!state);
  }
}
