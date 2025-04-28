/**
 * Ease Out Quadratic (slow down as it reaches the target).
 * t = progress [0..1]
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Move value towards target by maxDelta.
 */
export function moveTowards(
  current: number,
  target: number,
  maxDelta: number,
): number {
  const delta = target - current;

  if (Math.abs(delta) <= maxDelta) {
    return target;
  }
  return current + Math.sign(delta) * maxDelta;
}
