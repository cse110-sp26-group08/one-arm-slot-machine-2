import type { SlotSymbol } from '../../services/slot-machine-client.js';

/**
 * Render metadata for a single slot symbol in the active machine theme.
 */
export interface SlotSymbolDisplay {
  alt: string;
  assetUrl?: string;
  emblemText?: string;
}

/**
 * Visual theme contract for a slot-machine cabinet and its symbol art.
 */
export interface SlotMachineTheme {
  accentLabel: string;
  jackpotLabels: Array<{
    amount: string;
    name: string;
  }>;
  machineName: string;
  panelClassName: string;
  symbolDisplayMap: Record<SlotSymbol, SlotSymbolDisplay>;
}

/**
 * Resolves a bundled static asset URL relative to this theme module.
 *
 * @param {string} relativePath - Relative asset path under the repo asset folder.
 * @returns {string} Browser-ready asset URL.
 */
const resolveAssetUrl = (relativePath: string) => new URL(relativePath, import.meta.url).href;

/**
 * Pirate-themed reel art and cabinet copy used by the connected home slot machine.
 */
export const pirateTreasureTheme: SlotMachineTheme = {
  machineName: 'Blackwater Bounty',
  accentLabel: 'Treasure deck',
  panelClassName: 'pirateTreasure',
  jackpotLabels: [
    { name: 'Captain', amount: '10000.00' },
    { name: 'Fleet', amount: '4000.00' },
    { name: 'Booty', amount: '1000.00' },
    { name: 'Map', amount: '200.00' }
  ],
  symbolDisplayMap: {
    seven: {
      alt: 'Treasure map scroll',
      assetUrl: resolveAssetUrl('../../../assets/scroll_icon.png')
    },
    diamond: {
      alt: 'Gold doubloon',
      assetUrl: resolveAssetUrl('../../../assets/coin_icon.png')
    },
    bar: {
      alt: 'Pirate hook',
      assetUrl: resolveAssetUrl('../../../assets/hook_icon.png')
    },
    cherry: {
      alt: 'Sea potion',
      assetUrl: resolveAssetUrl('../../../assets/potion_icon.png')
    },
    bell: {
      alt: 'Powder barrel',
      assetUrl: resolveAssetUrl('../../../assets/barrel_icon.png')
    },
    horseshoe: {
      alt: 'Cannon bomb',
      assetUrl: resolveAssetUrl('../../../assets/bomb_icon.png')
    },
    wild: {
      alt: 'Wild compass emblem',
      emblemText: 'WILD'
    }
  }
};
