import { fetchSlotMachineState, type SlotPrizeId } from './slot-machine-client.js';

export const ENHANCED_LUCK_PRICE = 500;
export const SNOW_THEME_PRICE = 250;
export const ENHANCED_LUCK_DURATION_IN_MILLISECONDS = 60 * 60 * 1000;

export interface PrizeCatalogEntry {
  category: string;
  description: string;
  icon: string;
  id: SlotPrizeId;
  name: string;
  price: number;
}

const prizeCatalog: PrizeCatalogEntry[] = [
  {
    id: 'enhanced-luck',
    name: 'Enhanced luck',
    price: ENHANCED_LUCK_PRICE,
    category: 'Timed boost',
    icon: '\u2728',
    description: 'Tilts the reel weights toward premium symbols for the next hour.'
  },
  {
    id: 'snow-theme',
    name: 'Snow celebration',
    price: SNOW_THEME_PRICE,
    category: 'Win animation',
    icon: '\u2744\uFE0F',
    description: 'Replaces confetti with a snowfall animation every time you land a win.'
  }
];

/**
 * Returns the static prize catalog used by the frontend prize vault.
 *
 * @returns {Promise<PrizeCatalogEntry[]>} Available prize entries.
 */
export async function fetchPrizeCatalog() {
  return Promise.resolve(prizeCatalog);
}

/**
 * Purchases a prize through the slot-machine backend.
 *
 * @param {SlotPrizeId} prizeId - Prize identifier to purchase.
 * @returns {ReturnType<typeof fetchSlotMachineState>} Updated slot-machine state.
 */
export async function purchaseSlotMachinePrize(prizeId: SlotPrizeId) {
  const sessionToken = localStorage.getItem('slot-machine-session-token');

  if (!sessionToken) {
    throw new Error('Authentication is required.');
  }

  const response = await fetch('http://localhost:4000/api/slot-machine/prize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`
    },
    body: JSON.stringify({ prizeId })
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? 'Prize purchase failed.');
  }

  return payload as Awaited<ReturnType<typeof fetchSlotMachineState>>;
}
