import { fetchSlotMachineState, type SlotPrizeId } from './slot-machine-client.js';

export const ENHANCED_LUCK_PRICE = 500;
export const SOUNDTRACK_PRICE = 500;
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
    id: 'black-flag-theme',
    name: 'Black Flag March',
    price: SOUNDTRACK_PRICE,
    category: 'Music unlock',
    icon: '\uD83C\uDFBC',
    description: 'Unlocks the march-style pirate soundtrack used for a heavier deck atmosphere.'
  },
  {
    id: 'pirate-adventure-theme',
    name: 'Pirate Adventure',
    price: SOUNDTRACK_PRICE,
    category: 'Music unlock',
    icon: '\uD83C\uDFB6',
    description: 'Unlocks a brighter high-seas adventure theme you can switch to from the machine.'
  },
  {
    id: 'enhanced-luck',
    name: 'Enhanced luck',
    price: ENHANCED_LUCK_PRICE,
    category: 'Timed boost',
    icon: '\u2728',
    description: 'Tilts the reel weights toward premium symbols for the next hour.'
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
