export const ComponentName = {
  Position: "Position",
  Input: "Input",
  SpineComponent: "SpineComponent",
  ActionState: "ActionState",
  AnimationState: "AnimationState",
  GridPosition: "GridPosition",
  MoveTarget: "MoveTarget",
} as const;

export type ComponentName = keyof typeof ComponentName;
