export const SLOT_MACHINE_ROWS = 3;
export const SLOT_MACHINE_COLUMNS = 3;
export const DEFAULT_BET_AMOUNT = 25;
export const DEFAULT_BALANCE = 1000;

const _slotSymbols = ['seven', 'diamond', 'bar', 'cherry', 'bell', 'horseshoe', 'wild'] as const;
const paylineRows = [
  [0, 0, 0],
  [1, 1, 1],
  [2, 2, 2],
  [0, 1, 2],
  [2, 1, 0]
] as const;
const symbolWeights: Record<SlotSymbol, number> = {
  seven: 4,
  diamond: 6,
  bar: 10,
  cherry: 12,
  bell: 8,
  horseshoe: 7,
  wild: 3
};
const symbolPayoutMultipliers: Record<SlotSymbol, Record<number, number>> = {
  seven: { 3: 12 },
  diamond: { 3: 9 },
  bar: { 3: 7 },
  cherry: { 3: 5 },
  bell: { 3: 6 },
  horseshoe: { 3: 6 },
  wild: { 3: 15 }
};

export type SlotSymbol = (typeof _slotSymbols)[number];
export type SlotOutcome = 'loss' | 'near-miss' | 'win';

export interface WinningLine {
  matchingCount: number;
  path: number[];
  paylineIndex: number;
  payout: number;
  symbol: SlotSymbol;
}

export interface SlotMachineStats {
  currentBetAmount: number;
  numberOfSpins: number;
  totalBalance: number;
}

export interface SlotMachineState {
  grid: SlotSymbol[][];
  lastPayout: number;
  outcome: SlotOutcome;
  stats: SlotMachineStats;
  winningLines: WinningLine[];
}

const slotMachineStateByPlayer = new Map<string, SlotMachineState>();

export class SlotMachineStateError extends Error {}

/**
 * Returns the current slot-machine state for a player, creating one if needed.
 *
 * @param {string} playerId - Unique session or user identifier.
 * @returns {SlotMachineState} Current slot-machine state.
 */
export function getSlotMachineState(playerId: string) {
  const existingState = slotMachineStateByPlayer.get(playerId);

  if (existingState) {
    return existingState;
  }

  const createdState = createInitialSlotMachineState();
  slotMachineStateByPlayer.set(playerId, createdState);

  return createdState;
}

/**
 * Performs one slot-machine spin for a player and updates tracked stats.
 *
 * @param {string} playerId - Unique session or user identifier.
 * @returns {SlotMachineState} Updated slot-machine state after the spin.
 */
export function spinSlotMachine(playerId: string) {
  const currentState = getSlotMachineState(playerId);

  if (currentState.stats.currentBetAmount > currentState.stats.totalBalance) {
    throw new SlotMachineStateError('Current bet exceeds the remaining balance.');
  }

  const spunGrid = createRandomGrid();
  const evaluatedSpin = evaluateSpin(spunGrid, currentState.stats.currentBetAmount);
  const updatedState: SlotMachineState = {
    grid: spunGrid,
    lastPayout: evaluatedSpin.payout,
    outcome: evaluatedSpin.outcome,
    stats: {
      currentBetAmount: currentState.stats.currentBetAmount,
      numberOfSpins: currentState.stats.numberOfSpins + 1,
      totalBalance:
        currentState.stats.totalBalance -
        currentState.stats.currentBetAmount +
        evaluatedSpin.payout
    },
    winningLines: evaluatedSpin.winningLines
  };

  slotMachineStateByPlayer.set(playerId, updatedState);
  return updatedState;
}

/**
 * Updates the player's current bet amount while keeping it within the available balance.
 *
 * @param {string} playerId - Unique session or user identifier.
 * @param {number} nextBetAmount - Requested next bet amount.
 * @returns {SlotMachineState} Updated slot-machine state with the new bet amount.
 */
export function setSlotMachineBetAmount(playerId: string, nextBetAmount: number) {
  const currentState = getSlotMachineState(playerId);

  if (!Number.isInteger(nextBetAmount) || nextBetAmount <= 0) {
    throw new SlotMachineStateError('Bet amount must be a positive whole number.');
  }

  if (nextBetAmount > currentState.stats.totalBalance) {
    throw new SlotMachineStateError('Bet amount cannot exceed the available balance.');
  }

  const updatedState: SlotMachineState = {
    ...currentState,
    stats: {
      ...currentState.stats,
      currentBetAmount: nextBetAmount
    }
  };

  slotMachineStateByPlayer.set(playerId, updatedState);
  return updatedState;
}

/**
 * Creates the initial slot-machine state for a new player session.
 *
 * @returns {SlotMachineState} Initial slot-machine state.
 */
export function createInitialSlotMachineState(): SlotMachineState {
  return {
    grid: createRandomGrid(),
    lastPayout: 0,
    outcome: 'loss',
    stats: {
      totalBalance: DEFAULT_BALANCE,
      currentBetAmount: DEFAULT_BET_AMOUNT,
      numberOfSpins: 0
    },
    winningLines: []
  };
}

/**
 * Evaluates the slot-machine grid against all paylines.
 *
 * @param {SlotSymbol[][]} grid - Current slot-machine grid.
 * @param {number} betAmount - Current bet amount.
 * @returns {{ outcome: SlotOutcome; payout: number; winningLines: WinningLine[] }} Evaluated spin result.
 */
export function evaluateSpin(grid: SlotSymbol[][], betAmount: number) {
  const winningLines = paylineRows.flatMap((path, paylineIndex) => {
    const paylineSymbols = path.map((rowIndex, columnIndex) => grid[rowIndex][columnIndex]);
    const evaluatedPayline = evaluatePayline(paylineSymbols, betAmount);

    if (!evaluatedPayline) {
      return [];
    }

    return [
      {
        ...evaluatedPayline,
        path: [...path],
        paylineIndex
      }
    ];
  });
  const payout = winningLines.reduce(
    (totalPayout, winningLine) => totalPayout + winningLine.payout,
    0
  );

  if (winningLines.length > 0) {
    return {
      outcome: 'win' as const,
      payout,
      winningLines
    };
  }

  return {
    outcome: hasNearMiss(grid) ? ('near-miss' as const) : ('loss' as const),
    payout: 0,
    winningLines: []
  };
}

/**
 * Retained payout-only wrapper for existing callers and tests.
 *
 * @param {SlotSymbol[][]} grid - Current slot-machine grid.
 * @param {number} betAmount - Current bet amount.
 * @returns {number} Total payout for the spin.
 */
export function calculatePayout(grid: SlotSymbol[][], betAmount: number) {
  return evaluateSpin(grid, betAmount).payout;
}

/**
 * Generates a random 3x3 slot-machine grid using weighted symbol probabilities.
 *
 * @returns {SlotSymbol[][]} Randomized symbol grid.
 */
export function createRandomGrid() {
  return Array.from({ length: SLOT_MACHINE_ROWS }, () =>
    Array.from({ length: SLOT_MACHINE_COLUMNS }, () => chooseWeightedSymbol())
  );
}

/**
 * Evaluates a single payline from left to right.
 *
 * @param {SlotSymbol[]} paylineSymbols - Symbols across the payline.
 * @param {number} betAmount - Current bet amount.
 * @returns {Omit<WinningLine, 'path' | 'paylineIndex'> | null} Winning-line result.
 */
function evaluatePayline(paylineSymbols: SlotSymbol[], betAmount: number) {
  const resolvedSymbol =
    paylineSymbols.find((symbol) => symbol !== 'wild') ?? paylineSymbols[0];
  let matchingCount = 0;

  for (const symbol of paylineSymbols) {
    if (symbol === resolvedSymbol || symbol === 'wild' || resolvedSymbol === 'wild') {
      matchingCount += 1;
      continue;
    }

    break;
  }

  if (matchingCount < 3) {
    return null;
  }

  const payoutMultiplier =
    symbolPayoutMultipliers[resolvedSymbol][matchingCount] ??
    symbolPayoutMultipliers[resolvedSymbol][3];

  return {
    matchingCount,
    payout: betAmount * payoutMultiplier,
    symbol: resolvedSymbol
  };
}

/**
 * Detects a near miss by checking whether any payline begins with two matching symbols.
 *
 * @param {SlotSymbol[][]} grid - Current slot-machine grid.
 * @returns {boolean} True when the grid contains a near miss.
 */
function hasNearMiss(grid: SlotSymbol[][]) {
  return paylineRows.some((path) => {
    const firstSymbol = grid[path[0]][0];
    const secondSymbol = grid[path[1]][1];

    return firstSymbol === secondSymbol || firstSymbol === 'wild' || secondSymbol === 'wild';
  });
}

/**
 * Chooses a symbol using weighted probabilities.
 *
 * @returns {SlotSymbol} Weighted random symbol.
 */
function chooseWeightedSymbol() {
  const weightedPool = Object.entries(symbolWeights).flatMap(([symbol, weight]) =>
    Array.from({ length: weight }, () => symbol as SlotSymbol)
  );
  const randomIndex = Math.floor(Math.random() * weightedPool.length);

  return weightedPool[randomIndex];
}
