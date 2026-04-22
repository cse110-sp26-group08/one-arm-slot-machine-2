export const SLOT_MACHINE_ROWS = 3;
export const SLOT_MACHINE_COLUMNS = 3;
export const DEFAULT_BET_AMOUNT = 25;
export const DEFAULT_BALANCE = 1000;
export const ENHANCED_LUCK_PRICE = 500;
export const SOUNDTRACK_PRICE = 500;
export const ENHANCED_LUCK_DURATION_IN_MILLISECONDS = 60 * 60 * 1000;

const _slotSymbols = ['seven', 'diamond', 'bar', 'cherry', 'bell', 'horseshoe', 'wild'] as const;
const _slotPrizeIds = ['enhanced-luck', 'black-flag-theme', 'pirate-adventure-theme'] as const;
const _ownedSoundtrackIds = ['black-flag-theme', 'pirate-adventure-theme'] as const;
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
const enhancedLuckSymbolWeights: Record<SlotSymbol, number> = {
  seven: 8,
  diamond: 10,
  bar: 10,
  cherry: 11,
  bell: 8,
  horseshoe: 7,
  wild: 7
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
export type SlotPrizeId = (typeof _slotPrizeIds)[number];
export type OwnedSoundtrackId = (typeof _ownedSoundtrackIds)[number];
export type SoundtrackId = 'default-theme' | OwnedSoundtrackId;
export type WinCelebrationTheme = 'classic' | 'snow';

export interface SlotPrizeInventory {
  enhancedLuckExpiresAt: number | null;
  ownedSoundtrackIds: OwnedSoundtrackId[];
  selectedSoundtrackId: SoundtrackId;
}

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
  prizes: SlotPrizeInventory;
  stats: SlotMachineStats;
  winCelebrationTheme: WinCelebrationTheme;
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

  const spunGrid = createRandomGrid(resolveSymbolWeights(currentState));
  const evaluatedSpin = evaluateSpin(spunGrid, currentState.stats.currentBetAmount);
  const updatedState: SlotMachineState = {
    grid: spunGrid,
    lastPayout: evaluatedSpin.payout,
    outcome: evaluatedSpin.outcome,
    prizes: resolvePrizeInventory(currentState.prizes),
    stats: {
      currentBetAmount: currentState.stats.currentBetAmount,
      numberOfSpins: currentState.stats.numberOfSpins + 1,
      totalBalance:
        currentState.stats.totalBalance -
        currentState.stats.currentBetAmount +
        evaluatedSpin.payout
    },
    winCelebrationTheme: 'classic',
    winningLines: evaluatedSpin.winningLines
  };

  slotMachineStateByPlayer.set(playerId, updatedState);
  return updatedState;
}

/**
 * Purchases one of the available slot-machine prizes for the player.
 *
 * @param {string} playerId - Unique session or user identifier.
 * @param {SlotPrizeId} prizeId - Prize identifier to purchase.
 * @returns {SlotMachineState} Updated slot-machine state after the purchase.
 */
export function purchaseSlotMachinePrize(playerId: string, prizeId: SlotPrizeId) {
  if (!_slotPrizeIds.includes(prizeId)) {
    throw new SlotMachineStateError('Selected prize does not exist.');
  }

  const currentState = getSlotMachineState(playerId);
  const resolvedPrizes = resolvePrizeInventory(currentState.prizes);
  const prizePrice = resolvePrizePrice(prizeId);

  if (prizePrice > currentState.stats.totalBalance) {
    throw new SlotMachineStateError('Not enough balance to purchase that prize.');
  }

  if (isOwnedSoundtrackId(prizeId) && resolvedPrizes.ownedSoundtrackIds.includes(prizeId)) {
    throw new SlotMachineStateError('That soundtrack is already unlocked.');
  }

  const nextPrizes: SlotPrizeInventory =
    prizeId === 'enhanced-luck'
      ? {
          ...resolvedPrizes,
          enhancedLuckExpiresAt: Date.now() + ENHANCED_LUCK_DURATION_IN_MILLISECONDS
        }
      : {
          ...resolvedPrizes,
          ownedSoundtrackIds: [...resolvedPrizes.ownedSoundtrackIds, prizeId],
          selectedSoundtrackId: prizeId
        };
  const updatedState: SlotMachineState = {
    ...currentState,
    prizes: nextPrizes,
    stats: {
      ...currentState.stats,
      totalBalance: currentState.stats.totalBalance - prizePrice
    }
  };

  slotMachineStateByPlayer.set(playerId, updatedState);
  return updatedState;
}

/**
 * Selects one of the available soundtracks for the player.
 *
 * @param {string} playerId - Unique session or user identifier.
 * @param {SoundtrackId} soundtrackId - Soundtrack identifier to activate.
 * @returns {SlotMachineState} Updated slot-machine state with the selected soundtrack.
 */
export function setSlotMachineSoundtrack(playerId: string, soundtrackId: SoundtrackId) {
  const currentState = getSlotMachineState(playerId);
  const resolvedPrizes = resolvePrizeInventory(currentState.prizes);

  if (
    soundtrackId !== 'default-theme' &&
    !resolvedPrizes.ownedSoundtrackIds.includes(soundtrackId)
  ) {
    throw new SlotMachineStateError('That soundtrack has not been unlocked yet.');
  }

  const updatedState: SlotMachineState = {
    ...currentState,
    prizes: {
      ...resolvedPrizes,
      selectedSoundtrackId: soundtrackId
    }
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
    grid: createRandomGrid(symbolWeights),
    lastPayout: 0,
    outcome: 'loss',
    prizes: {
      enhancedLuckExpiresAt: null,
      ownedSoundtrackIds: [],
      selectedSoundtrackId: 'default-theme'
    },
    stats: {
      totalBalance: DEFAULT_BALANCE,
      currentBetAmount: DEFAULT_BET_AMOUNT,
      numberOfSpins: 0
    },
    winCelebrationTheme: 'classic',
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
export function createRandomGrid(weightTable: Record<SlotSymbol, number> = symbolWeights) {
  return Array.from({ length: SLOT_MACHINE_ROWS }, () =>
    Array.from({ length: SLOT_MACHINE_COLUMNS }, () => chooseWeightedSymbol(weightTable))
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
function chooseWeightedSymbol(weightTable: Record<SlotSymbol, number>) {
  const weightedPool = Object.entries(weightTable).flatMap(([symbol, weight]) =>
    Array.from({ length: weight }, () => symbol as SlotSymbol)
  );
  const randomIndex = Math.floor(Math.random() * weightedPool.length);

  return weightedPool[randomIndex];
}

function resolvePrizeInventory(prizes: SlotPrizeInventory) {
  if (prizes.enhancedLuckExpiresAt && prizes.enhancedLuckExpiresAt <= Date.now()) {
    return {
      ...prizes,
      enhancedLuckExpiresAt: null
    };
  }

  return prizes;
}

function resolveSymbolWeights(state: SlotMachineState) {
  return resolvePrizeInventory(state.prizes).enhancedLuckExpiresAt
    ? enhancedLuckSymbolWeights
    : symbolWeights;
}

function resolvePrizePrice(prizeId: SlotPrizeId) {
  if (prizeId === 'enhanced-luck') {
    return ENHANCED_LUCK_PRICE;
  }

  return SOUNDTRACK_PRICE;
}

function isOwnedSoundtrackId(prizeId: SlotPrizeId): prizeId is OwnedSoundtrackId {
  return prizeId !== 'enhanced-luck';
}
