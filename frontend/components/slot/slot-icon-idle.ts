/**
 * Idle animation timing boundaries for slot symbols.
 */
export const IDLE_ANIMATION_MIN_DELAY_MS = 1800;
export const IDLE_ANIMATION_MAX_DELAY_MS = 4200;
export const IDLE_ANIMATION_DURATION_MS = 1400;

/**
 * Creates a randomized idle delay within the configured range.
 *
 * @param {() => number} randomValue - Random number generator returning a value in [0, 1).
 * @returns {number} Delay in milliseconds before the next idle animation begins.
 */
export function createIdleAnimationDelay(randomValue: () => number = Math.random) {
  const boundedRandomValue = Math.min(Math.max(randomValue(), 0), 0.999999);
  const delayRange = IDLE_ANIMATION_MAX_DELAY_MS - IDLE_ANIMATION_MIN_DELAY_MS;

  return Math.round(IDLE_ANIMATION_MIN_DELAY_MS + boundedRandomValue * delayRange);
}

/**
 * Picks the next symbol index to animate.
 *
 * @param {number} totalSymbols - Number of symbols available.
 * @param {number} currentIndex - Symbol index that is currently active, or -1 if none are active.
 * @param {() => number} randomValue - Random number generator returning a value in [0, 1).
 * @returns {number} Index of the next symbol to animate, or -1 when no symbols are available.
 */
export function selectNextIdleSymbolIndex(
  totalSymbols: number,
  currentIndex: number,
  randomValue: () => number = Math.random
) {
  if (totalSymbols <= 0) {
    return -1;
  }

  if (totalSymbols === 1) {
    return 0;
  }

  const boundedRandomValue = Math.min(Math.max(randomValue(), 0), 0.999999);
  const randomIndex = Math.floor(boundedRandomValue * totalSymbols);

  if (randomIndex !== currentIndex) {
    return randomIndex;
  }

  return (currentIndex + 1) % totalSymbols;
}
