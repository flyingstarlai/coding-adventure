import { ComponentTypes } from "../types/ComponentTypes.ts";

export class Entity {
  private components = new Map<
    keyof ComponentTypes,
    ComponentTypes[keyof ComponentTypes]
  >();

  addComponent<K extends keyof ComponentTypes>(
    name: K,
    component: ComponentTypes[K],
  ): void {
    this.components.set(name, component);
  }

  getComponent<K extends keyof ComponentTypes>(
    name: K,
  ): ComponentTypes[K] | undefined {
    return this.components.get(name) as ComponentTypes[K] | undefined;
  }

  removeComponent<K extends keyof ComponentTypes>(name: K): void {
    this.components.delete(name);
  }
}
