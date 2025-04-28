import { CommandButton } from "../buttons/CommandButton.ts";
import { CommandQueueManager } from "../../managers/CommandQueueManager.ts";
import { Container, FederatedPointerEvent, Rectangle } from "pixi.js";

export class DragManager {
  private stage: Container;
  private draggingButton: CommandButton | null = null;
  private commandQueueView: Container;
  private commandQueueManager: CommandQueueManager;
  private uiView: Container;
  private readonly uiArea: Rectangle;
  private allowDrag = true;

  constructor(
    stage: Container,
    commandQueueManager: CommandQueueManager,
    commandQueueView: Container,
    uiView: Container,
    private onQueueChanged: () => void,
    private isInteractionEnabled: () => boolean,
  ) {
    this.stage = stage;
    this.commandQueueManager = commandQueueManager;
    this.commandQueueView = commandQueueView;
    this.uiView = uiView;

    // Hit area for UI
    // Make stage able to receive global pointer events
    this.stage.eventMode = "static";

    const global = this.uiView.getGlobalPosition();
    this.uiArea = new Rectangle(
      global.x,
      global.y,
      this.uiView.width,
      this.uiView.height,
    );

    this.stage.hitArea = this.uiArea;

    this.stage.on("pointerup", this.onDragEnd);
    this.stage.on("pointerupoutside", this.onDragEnd);
  }

  enableDrag(button: CommandButton) {
    if (!this.isInteractionEnabled()) {
      return;
    }

    button.sprite.eventMode = "static";
    button.sprite.cursor = "pointer";

    button.sprite.on("pointerdown", (event) => {
      this.startDrag(button, event);
    });
  }

  private startDrag(button: CommandButton, event: FederatedPointerEvent) {
    if (!this.isInteractionEnabled() || !this.allowDrag) {
      return;
    }

    if (this.commandQueueManager.isButtonInQueue(button)) {
      this.draggingButton = button;
      this.commandQueueManager.removeCommand(button);
    } else {
      this.draggingButton = button.cloneForQueue();
    }
    this.stage.addChild(this.draggingButton);

    this.draggingButton.position.copyFrom(event.global);
    this.draggingButton.alpha = 0.5;

    this.stage.on("pointermove", this.onDragMove);
  }

  private onDragMove = (event: FederatedPointerEvent) => {
    if (!this.draggingButton) return;
    // Check if inside UI area
    this.draggingButton.parent?.toLocal(
      event.global,
      undefined,
      this.draggingButton.position,
    );

    if (
      this.draggingButton.position.y <
      this.uiArea.y + this.uiArea.height / 2
    ) {
      this.commandQueueManager.updateLiveShift(this.draggingButton.x);
    }
  };

  private onDragEnd = (event: FederatedPointerEvent) => {
    if (!this.draggingButton) return;

    const dropX = event.global.x;
    const dropY = event.global.y;

    if (this.isInsideQueueArea(dropX, dropY)) {
      const insertIndex =
        this.commandQueueManager.getDragButtonInsertIndex(dropX);

      const newButton = this.commandQueueManager.addExistingCommand(
        this.draggingButton,
        insertIndex,
      );

      this.enableDrag(newButton);
    }

    // Clean up
    this.stage.off("pointermove", this.onDragMove);

    if (this.stage.children.includes(this.draggingButton)) {
      this.stage.removeChild(this.draggingButton);
    }
    this.draggingButton.destroy();
    this.draggingButton = null;

    this.commandQueueManager.relayout();
    this.onQueueChanged();
  };

  private isInsideQueueArea(x: number, y: number): boolean {
    const globalPos = this.commandQueueView.getGlobalPosition();

    return (
      x >= globalPos.x &&
      y >= globalPos.y &&
      x <= globalPos.x + this.commandQueueView.width &&
      y <= globalPos.y + this.commandQueueView.height
    );
  }

  public setDragEnabled(enabled: boolean) {
    this.allowDrag = enabled;
  }
}
