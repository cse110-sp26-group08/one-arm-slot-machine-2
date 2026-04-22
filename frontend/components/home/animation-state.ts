import type { SlotMachineState, SlotSymbol } from '../../services/slot-machine-client.js';

export type SlotMachineAnimationState =
  | 'idle'
  | 'spinning'
  | 'loss'
  | 'near-miss'
  | 'win'
  | 'big-win'
  | 'jackpot';

const paylinePaths = [
  [0, 0, 0],
  [1, 1, 1],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
] as const;

/**
 * Resolves the main animation state for the slot-machine page.
 *
 * @param {SlotMachineState} slotMachineState - Current slot-machine state.
 * @param {boolean} isSpinning - Whether the reels are currently spinning.
 * @returns {SlotMachineAnimationState} Animation state identifier for the UI.
 */
export function resolveSlotMachineAnimationState(
  slotMachineState: SlotMachineState,
  isSpinning: boolean
) {
  if (isSpinning) {
    return 'spinning' as const;
  }

  if (slotMachineState.outcome === 'near-miss') {
    return 'near-miss' as const;
  }

  if (slotMachineState.outcome === 'loss') {
    return slotMachineState.stats.numberOfSpins === 0 ? ('idle' as const) : ('loss' as const);
  }

  return resolveWinAnimationTier(slotMachineState);
}

/**
 * Returns a win animation tier based on payout size.
 *
 * @param {SlotMachineState} slotMachineState - Current slot-machine state.
 * @returns {Extract<SlotMachineAnimationState, 'win' | 'big-win' | 'jackpot'>} Win tier.
 */
export function resolveWinAnimationTier(slotMachineState: SlotMachineState) {
  const payoutRatio =
    slotMachineState.stats.currentBetAmount > 0
      ? slotMachineState.lastPayout / slotMachineState.stats.currentBetAmount
      : 0;

  if (slotMachineState.lastPayout >= 500 || payoutRatio >= 12) {
    return 'jackpot' as const;
  }

  if (slotMachineState.lastPayout >= 150 || payoutRatio >= 6) {
    return 'big-win' as const;
  }

  return 'win' as const;
}

/**
 * Finds the reel cells that form qualifying near-miss starts.
 *
 * @param {SlotMachineState['grid']} grid - Final reel grid.
 * @returns {string[]} Cell keys in `row-column` format.
 */
export function resolveNearMissPositionKeys(grid: SlotMachineState['grid']) {
  const positionKeys = new Set<string>();

  for (const paylinePath of paylinePaths) {
    const paylineSymbols = paylinePath.map((rowIndex, columnIndex) => grid[rowIndex][columnIndex]);
    const resolvedSymbol = paylineSymbols.find((symbol) => symbol !== 'wild');

    if (!resolvedSymbol) {
      continue;
    }

    if (
      !matchesSymbol(paylineSymbols[0], resolvedSymbol) ||
      !matchesSymbol(paylineSymbols[1], resolvedSymbol) ||
      matchesSymbol(paylineSymbols[2], resolvedSymbol)
    ) {
      continue;
    }

    positionKeys.add(`${paylinePath[0]}-0`);
    positionKeys.add(`${paylinePath[1]}-1`);
  }

  return [...positionKeys];
}

/**
 * Returns whether a symbol can stand in for the requested payline symbol.
 *
 * @param {SlotSymbol} symbol - Current reel symbol.
 * @param {SlotSymbol} resolvedSymbol - Target payline symbol.
 * @returns {boolean} True when the symbol matches or substitutes.
 */
function matchesSymbol(symbol: SlotSymbol, resolvedSymbol: SlotSymbol) {
  return symbol === resolvedSymbol || symbol === 'wild' || resolvedSymbol === 'wild';
}
