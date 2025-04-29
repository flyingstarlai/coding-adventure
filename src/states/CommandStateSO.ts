import { CommandType } from "../types/CommandType";

export class CommandStateSO {
  private static _instance: CommandStateSO;

  private _commands: CommandType[] = [];
  private _currentIndex: number = 0;

  private constructor() {}

  static getInstance(): CommandStateSO {
    if (!CommandStateSO._instance) {
      CommandStateSO._instance = new CommandStateSO();
    }
    return CommandStateSO._instance;
  }

  getCommands(): CommandType[] {
    return [...this._commands];
  }

  setCommands(commands: CommandType[]): void {
    this._commands = [...commands];
    // this._currentIndex = 0;
  }

  getCurrentCommand(): CommandType {
    return this._commands[this._currentIndex];
  }

  advance(): void {
    this._currentIndex++;
  }

  forceDone(): void {
    this._currentIndex = this._commands.length;
  }

  isDone(): boolean {
    return this._currentIndex >= this._commands.length;
  }

  reset(): void {
    this._currentIndex = 0;
  }

  getCurrentIndex(): number {
    return this._currentIndex;
  }

  getLength(): number {
    return this._commands.length;
  }
}
