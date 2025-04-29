import { Application, Container, Graphics, Texture } from "pixi.js";
import { AssetAlias } from "../assets/AssetAlias.ts";
import { CommandQueueManager } from "../managers/CommandQueueManager.ts";
import { DragManager } from "../ui/drag/DragManager.ts";
import { CommandButton } from "../ui/buttons/CommandButton.ts";
import { ButtonManager } from "../ui/buttons/ButtonManager.ts";
import { ButtonSprite } from "../ui/buttons/ButtonSprite.ts";
import { GameConstants } from "../constants/GameConstants.ts";
import { LevelResultPopup } from "../ui/popup/LevelResultPopup.ts";
import { UIEventManager } from "../managers/UIEventManager.ts";
import { GameEventManager } from "../managers/GameEventManager.ts";
import { Scene } from "../managers/SceneManager.ts";

export class UIScene implements Scene {
  public container: Container;
  private app: Application;

  private readonly uiView: Container;
  private readonly commandQueueView: Container; // Row 1
  private readonly controllerSourceView: Container; // Row 2

  private interactionEnabled = true;

  private buttonManager: ButtonManager;
  private commandQueueManager!: CommandQueueManager;
  private dragManager!: DragManager;
  private sourceButtons: CommandButton[] = [];
  private playButton!: ButtonSprite;
  private stopButton!: ButtonSprite;
  private levelResultPopup!: LevelResultPopup;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();

    this.uiView = new Container();
    this.container.addChild(this.uiView);

    // Create Rows
    this.commandQueueView = new Container();
    this.controllerSourceView = new Container();

    this.uiView.addChild(this.commandQueueView);
    this.uiView.addChild(this.controllerSourceView);

    // Create play button
    this.buttonManager = new ButtonManager();
  }

  init(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    console.log(`Screen: ${screenWidth} | ${screenHeight}`);

    // Define UI area height
    const uiHeight = GameConstants.UI_HEIGHT;

    // Position UI View at the bottom
    this.uiView.y = screenHeight - uiHeight;
    this.uiView.width = screenWidth;
    this.uiView.height = uiHeight;

    const rowHeight = GameConstants.UI_ROW_HEIGHT;

    // === Init CommandQueue Area ===
    const queueBackground = new Graphics();
    queueBackground.fill({ color: 0x00ff00, alpha: 0.1 }); // transparent fill
    queueBackground.rect(0, 0, screenWidth, rowHeight);
    queueBackground.fill(); // apply fill
    this.commandQueueView.addChild(queueBackground);

    const queueOutline = new Graphics();
    queueOutline.setStrokeStyle({ width: 2, color: 0x00ff00, alpha: 1 }); // Green
    queueOutline.rect(0, 0, screenWidth, rowHeight);
    queueOutline.stroke();
    this.commandQueueView.addChildAt(queueOutline, 0);

    // === Init SourceButton Area ====
    this.controllerSourceView.y = rowHeight;

    const sourceBackground = new Graphics();
    sourceBackground.fill({ color: 0x0000ff, alpha: 0.1 });
    sourceBackground.rect(0, 0, screenWidth, rowHeight);
    sourceBackground.fill();
    this.controllerSourceView.addChild(sourceBackground);

    const sourceOutline = new Graphics();
    sourceOutline.setStrokeStyle({ width: 2, color: 0x0000ff, alpha: 1 });
    sourceOutline.rect(
      0,
      0,
      this.controllerSourceView.width,
      this.controllerSourceView.height,
    );
    sourceOutline.stroke();
    this.controllerSourceView.addChildAt(sourceOutline, 0);

    // === Create CommandQueueManager ===
    this.commandQueueManager = new CommandQueueManager({
      width: this.commandQueueView.width,
      height: this.commandQueueView.height,
      spacing: 80,
    });
    this.commandQueueView.addChild(this.commandQueueManager.container);

    // == Create Source Buttons
    const texture = Texture.from(AssetAlias.UICommandUp);

    this.sourceButtons = [
      new CommandButton(texture, "left"),
      new CommandButton(texture, "right"),
      new CommandButton(texture, "up"),
      new CommandButton(texture, "down"),
    ];

    // === Layout Source Buttons ===
    const spacing = 80;
    let startX = spacing;

    for (const button of this.sourceButtons) {
      button.x = startX;
      button.y = this.controllerSourceView.height / 2;
      this.controllerSourceView.addChild(button);
      startX += spacing;
    }

    // === Setup Drag Manager ===
    this.dragManager = new DragManager(
      this.app.stage,
      this.commandQueueManager,
      this.commandQueueView,
      this.uiView,
      () => this.updatePlayButtonEnabled(),
      () => this.isInteractionEnabled(),
    );

    for (const button of this.sourceButtons) {
      this.dragManager.enableDrag(button);
    }

    // === Add Play Button ===
    this.playButton = this.buttonManager.createButton({
      texture: AssetAlias.UIControlPlay,
      x: this.uiView.width - 80,
      y: this.uiView.height * 0.25,
      onPress: () => {
        this.setPlayButtonPlaying(true);
        UIEventManager.PlayButton.emit();
      },
    });
    this.updatePlayButtonEnabled();
    this.uiView.addChild(this.playButton);

    // ==== Add Stop Button
    this.stopButton = this.buttonManager.createButton({
      texture: AssetAlias.UIControlStop,
      x: this.uiView.width - 80,
      y: this.uiView.height * 0.25,
      onPress: () => {
        this.setPlayButtonPlaying(false);
        UIEventManager.StopButton.emit();
      },
    });
    this.stopButton.visible = false;
    this.stopButton.setEnabled(true);
    this.uiView.addChild(this.stopButton);

    //  === Result Popup ===
    this.levelResultPopup = new LevelResultPopup(
      () => {
        this.setEnableButton(true);
        UIEventManager.RetryButton.emit();
      },
      () => {
        this.setEnableButton(true);
        UIEventManager.ContinueButton.emit();
      },
    );

    // === Event Listener ===
    GameEventManager.LevelCompleted.subscribe(() => this.handleLevelComplete());
    GameEventManager.LevelFailed.subscribe(() => this.handleLevelFailed());
    GameEventManager.HighlightCommand.subscribe((index: number) =>
      this.handleHighlightCommand(index),
    );
    GameEventManager.ResetHighlightCommand.subscribe(() =>
      this.handleResetHighlightCommand(),
    );
  }

  private setEnableButton(enable: boolean): void {
    this.playButton.setEnabled(enable);
    this.stopButton.setEnabled(enable);
  }

  private handleHighlightCommand(index: number) {
    this.commandQueueManager.getCommandButtons().forEach((button, i) => {
      if (i === index) {
        button.highlight();
      } else {
        button.unhighlight();
      }
    });
  }

  private handleResetHighlightCommand() {
    this.commandQueueManager
      .getCommandButtons()
      .forEach((button) => button.unhighlight());
  }

  private handleLevelComplete(): void {
    this.setEnableButton(false);
    this.levelResultPopup.showWin();
  }

  private handleLevelFailed(): void {
    this.setEnableButton(false);
    this.levelResultPopup.showLose();
  }

  updatePlayButtonEnabled(): void {
    if (this.commandQueueManager.getCommands().length > 0) {
      this.playButton.setEnabled(true);
    } else {
      this.playButton.setEnabled(false);
    }
  }

  public isInteractionEnabled(): boolean {
    return this.interactionEnabled;
  }

  public setInteractionEnabled(enabled: boolean): void {
    this.interactionEnabled = enabled;

    this.playButton?.setEnabled(enabled);

    for (const button of this.sourceButtons) {
      button.sprite.eventMode = enabled ? "static" : "none";
    }
  }

  public setPlayButtonPlaying(isPlaying: boolean): void {
    if (isPlaying) {
      this.playButton.visible = false;
      this.stopButton.visible = true;
    } else {
      this.playButton.visible = true;
      this.stopButton.visible = false;
    }
  }

  public destroy(): void {
    GameEventManager.LevelCompleted.unsubscribe(() =>
      this.handleLevelComplete(),
    );
    GameEventManager.LevelFailed.unsubscribe(() => this.handleLevelFailed());
    GameEventManager.HighlightCommand.unsubscribe((index: number) =>
      this.handleHighlightCommand(index),
    );
    GameEventManager.ResetHighlightCommand.unsubscribe(() =>
      this.handleResetHighlightCommand(),
    );
    this.container.destroy({ children: true });
  }
}
