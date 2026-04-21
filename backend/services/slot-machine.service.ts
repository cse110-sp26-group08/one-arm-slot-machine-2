export const SLOT_MACHINE_ROWS = 3;
export const SLOT_MACHINE_COLUMNS = 5;
export const DEFAULT_BET_AMOUNT = 25;
export const DEFAULT_BALANCE = 1000;

const slotSymbols = ['seven', 'diamond', 'bar', 'cherry', 'bell', 'horseshoe'] as const;

export type SlotSymbol = (typeof slotSymbols)[number];

export interface SlotMachineStats {
  currentBetAmount: number;
  numberOfSpins: number;
  totalBalance: number;
}

export interface SlotMachineState {
  grid: SlotSymbol[][];
  lastPayout: number;
  stats: SlotMachineStats;
}

const slotMachineStateByPlayer = new Map<string, SlotMachineState>();

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
  const spunGrid = createRandomGrid();
  const payout = calculatePayout(spunGrid, currentState.stats.currentBetAmount);
  const updatedState: SlotMachineState = {
    grid: spunGrid,
    lastPayout: payout,
    stats: {
      currentBetAmount: currentState.stats.currentBetAmount,
      numberOfSpins: currentState.stats.numberOfSpins + 1,
      totalBalance: currentState.stats.totalBalance - currentState.stats.currentBetAmount + payout
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
    stats: {
      totalBalance: DEFAULT_BALANCE,
      currentBetAmount: DEFAULT_BET_AMOUNT,
      numberOfSpins: 0
    }
  };
}

/**
 * Calculates the payout by checking consecutive matching symbols from the left side of each row.
 *
 * @param {SlotSymbol[][]} grid - Current slot-machine grid.
 * @param {number} betAmount - Current bet amount.
 * @returns {number} Total payout for the spin.
 */
export function calculatePayout(grid: SlotSymbol[][], betAmount: number) {
  return grid.reduce((totalPayout, row) => {
    const firstSymbol = row[0];
    let matchingCount = 1;

    for (let columnIndex = 1; columnIndex < row.length; columnIndex += 1) {
      if (row[columnIndex] !== firstSymbol) {
        break;
      }

      matchingCount += 1;
    }

    if (matchingCount < 3) {
      return totalPayout;
    }

    return totalPayout + betAmount * matchingCount;
  }, 0);
}

/**
 * Generates a random 3x5 slot-machine grid.
 *
 * @returns {SlotSymbol[][]} Randomized symbol grid.
 */
export function createRandomGrid() {
  return Array.from({ length: SLOT_MACHINE_ROWS }, () =>
    Array.from({ length: SLOT_MACHINE_COLUMNS }, () => {
      const randomIndex = Math.floor(Math.random() * slotSymbols.length);
      return slotSymbols[randomIndex];
    })
  );
}
