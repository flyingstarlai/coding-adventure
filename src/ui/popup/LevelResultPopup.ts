export class LevelResultPopup {
  private popupElement: HTMLElement;
  private messageElement: HTMLElement;
  private retryButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private onRetryCallback: () => void;
  private onNextCallback: () => void;

  constructor(onRetry: () => void, onNext: () => void) {
    this.popupElement = document.getElementById("level-popup")!;
    this.messageElement = document.getElementById("popup-message")!;
    this.retryButton = document.getElementById(
      "retry-button",
    ) as HTMLButtonElement;
    this.nextButton = document.getElementById(
      "next-button",
    ) as HTMLButtonElement;
    this.onRetryCallback = onRetry;
    this.onNextCallback = onNext;

    this.retryButton.addEventListener("click", () => {
      this.hide();
      this.onRetryCallback();
    });

    this.nextButton.addEventListener("click", () => {
      this.hide();
      this.onNextCallback();
    });

    this.hide();
  }

  showWin(): void {
    this.messageElement.textContent = "🎉 Congratulations!";
    this.retryButton.style.display = "none";
    this.nextButton.style.display = "inline-block"; // Show next button
    this.popupElement.style.display = "block";
  }

  showLose(): void {
    this.messageElement.textContent = "❌ Level Failed!";
    this.retryButton.style.display = "inline-block"; // Show retry button
    this.nextButton.style.display = "none";
    this.popupElement.style.display = "block";
  }

  hide(): void {
    this.popupElement.style.display = "none";
  }
}
