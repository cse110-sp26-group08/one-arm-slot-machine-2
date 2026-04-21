import type { SlotSymbol } from '../../services/slot-machine-client.js';

export interface SlotMachineTheme {
  accentLabel: string;
  machineName: string;
  panelClassName: string;
  symbolMap: Record<SlotSymbol, string>;
}

export const classicGoldTheme: SlotMachineTheme = {
  machineName: 'Marquee Gold',
  accentLabel: 'Floor one',
  panelClassName: 'classicGold',
  symbolMap: {
    seven: '7',
    diamond: '<>',
    bar: 'BAR',
    cherry: 'CH',
    bell: 'BL',
    horseshoe: 'HS',
    wild: 'WILD'
  }
};
