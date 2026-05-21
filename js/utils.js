/**
 * Linear interpolation — used for smooth cursor lag.
 * @param {number} a  current value
 * @param {number} b  target value
 * @param {number} t  factor 0–1
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Ease-out quadratic — used for countUp animation.
 * @param {number} t  progress 0–1
 */
export function easeOutQuad(t) {
  return t * (2 - t);
}

/**
 * Returns true on touch-only devices (no fine pointer).
 */
export function isTouchDevice() {
  return !window.matchMedia('(hover: hover)').matches;
}
