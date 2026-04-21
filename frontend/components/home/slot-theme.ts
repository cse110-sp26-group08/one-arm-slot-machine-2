import type { SlotSymbol } from '../../services/slot-machine-client.js';

export interface SlotMachineTheme {
  accentLabel: string;
  jackpotLabels: Array<{
    amount: string;
    name: string;
  }>;
  machineName: string;
  panelClassName: string;
  symbolLabelMap: Record<SlotSymbol, string>;
  symbolMap: Record<SlotSymbol, string>;
}

export const classicGoldTheme: SlotMachineTheme = {
  machineName: 'Marquee Gold',
  accentLabel: 'Floor one',
  panelClassName: 'classicGold',
  jackpotLabels: [
    { name: 'Grand', amount: '10000.00' },
    { name: 'Major', amount: '4000.00' },
    { name: 'Minor', amount: '1000.00' },
    { name: 'Mini', amount: '200.00' }
  ],
  symbolLabelMap: {
    seven: 'Lucky seven',
    diamond: 'Lava orb',
    bar: 'Hot stripe',
    cherry: 'Cherry burst',
    bell: 'Golden bell',
    horseshoe: 'Royal charm',
    wild: 'Wild queen'
  },
  symbolMap: {
    seven: '\u0037\uFE0F\u20E3',
    diamond: '\uD83C\uDF0B',
    bar: '\u2728',
    cherry: '\uD83C\uDF52',
    bell: '\uD83D\uDD14',
    horseshoe: '\uD83D\uDC51',
    wild: '\uD83D\uDC78'
  }
};
