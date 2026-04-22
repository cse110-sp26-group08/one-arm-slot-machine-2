import type { SlotSymbol } from '../../services/slot-machine-client.js';

export interface SlotSymbolDisplay {
  alt: string;
  assetUrl?: string;
  emblemText?: string;
}

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

const resolveAssetUrl = (relativePath: string) => new URL(relativePath, import.meta.url).href;

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
