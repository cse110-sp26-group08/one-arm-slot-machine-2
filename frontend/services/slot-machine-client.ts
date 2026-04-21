const SLOT_MACHINE_API_BASE_URL = 'http://localhost:4000/api/slot-machine';
const SESSION_STORAGE_KEY = 'slot-machine-session-token';

export type SlotSymbol =
  | 'seven'
  | 'diamond'
  | 'bar'
  | 'cherry'
  | 'bell'
  | 'horseshoe'
  | 'wild';
export type SlotOutcome = 'loss' | 'near-miss' | 'win';
export type SlotPrizeId = 'enhanced-luck' | 'snow-theme';
export type WinCelebrationTheme = 'classic' | 'snow';

export interface WinningLine {
  matchingCount: number;
  path: number[];
  paylineIndex: number;
  payout: number;
  symbol: SlotSymbol;
}

export interface SlotMachineState {
  grid: SlotSymbol[][];
  lastPayout: number;
  outcome: SlotOutcome;
  prizes: {
    enhancedLuckExpiresAt: number | null;
    snowThemeUnlocked: boolean;
  };
  stats: {
    currentBetAmount: number;
    numberOfSpins: number;
    totalBalance: number;
  };
  winCelebrationTheme: WinCelebrationTheme;
  winningLines: WinningLine[];
}

/**
 * Fetches the current slot-machine state for the authenticated user.
 *
 * @returns {Promise<SlotMachineState>} Current slot-machine state.
 */
export async function fetchSlotMachineState() {
  return sendAuthenticatedSlotMachineRequest<SlotMachineState>('/state', {
    method: 'GET'
  });
}

/**
 * Executes one slot-machine spin for the authenticated user.
 *
 * @returns {Promise<SlotMachineState>} Updated slot-machine state.
 */
export async function spinSlotMachine() {
  return sendAuthenticatedSlotMachineRequest<SlotMachineState>('/spin', {
    method: 'POST'
  });
}

/**
 * Updates the current bet amount for the authenticated user.
 *
 * @param {number} betAmount - Requested next bet amount.
 * @returns {Promise<SlotMachineState>} Updated slot-machine state.
 */
export async function updateSlotMachineBetAmount(betAmount: number) {
  return sendAuthenticatedSlotMachineRequest<SlotMachineState>('/bet', {
    method: 'POST',
    body: JSON.stringify({ betAmount })
  });
}

/**
 * Purchases a prize upgrade for the authenticated user.
 *
 * @param {SlotPrizeId} prizeId - Prize identifier to purchase.
 * @returns {Promise<SlotMachineState>} Updated slot-machine state.
 */
export async function purchaseSlotMachinePrize(prizeId: SlotPrizeId) {
  return sendAuthenticatedSlotMachineRequest<SlotMachineState>('/prize', {
    method: 'POST',
    body: JSON.stringify({ prizeId })
  });
}

/**
 * Sends an authenticated request to the slot-machine API.
 *
 * @template ResponseBody
 * @param {string} path - Relative slot-machine API path.
 * @param {RequestInit} options - Fetch options for the request.
 * @returns {Promise<ResponseBody>} Parsed API response.
 */
async function sendAuthenticatedSlotMachineRequest<ResponseBody>(
  path: string,
  options: RequestInit
) {
  const sessionToken = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionToken) {
    throw new Error('Authentication is required.');
  }

  const response = await fetch(`${SLOT_MACHINE_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
      ...(options.headers ?? {})
    }
  });

  const payload = (await response.json()) as { error?: string } & ResponseBody;

  if (!response.ok) {
    throw new Error(payload.error ?? 'Unable to reach the slot machine.');
  }

  return payload;
}
