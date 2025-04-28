import { System } from "./System";

export class World {
  private systems: System[] = [];

  public addSystem(system: System) {
    this.systems.push(system);
  }

  public update(delta: number) {
    for (const system of this.systems) {
      system.update(delta);
    }
  }
}
