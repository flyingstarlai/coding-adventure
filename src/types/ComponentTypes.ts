import { Position } from "../components/Position.ts";
import { Input } from "../components/Input.ts";
import { SpineComponent } from "../components/SpineComponent.ts";
import { ActionState } from "../components/ActionState.ts";
import { AnimationState } from "../components/AnimationState.ts";
import { SpriteRenderer } from "../components/SpriteRenderer.ts";
import { GridPosition } from "../components/GridPosition.ts";
import { MoveTarget } from "../components/MoveTarget.ts";
import { Facing } from "../components/Facing.ts";
import { FallState } from "../components/FallState.ts";

export interface ComponentTypes {
  Position: Position;
  Input: Input;
  SpineComponent: SpineComponent;
  ActionState: ActionState;
  AnimationState: AnimationState;
  SpriteRenderer: SpriteRenderer;
  GridPosition: GridPosition;
  MoveTarget: MoveTarget;
  Facing: Facing;
  FallState: FallState;
}
