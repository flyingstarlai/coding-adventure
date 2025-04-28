import { Input } from "../components/Input";
import { ActionState } from "../components/ActionState";

export function clearInput(input: Input, actionState?: ActionState): void {
  input.left = false;
  input.right = false;
  input.up = false;
  input.down = false;

  if (actionState) {
    actionState.walk = false;
    actionState.crouch = false;
    actionState.idle = !actionState.attack || !actionState.crouch;
  }
}

export function hasMoveInput(input: Input): boolean {
  return input.left || input.right || input.up || input.down;
}
