import { pirateTreasureTheme } from '../home/slot-theme.js';

export const loginMarqueeSymbols = [
  pirateTreasureTheme.symbolDisplayMap.seven,
  pirateTreasureTheme.symbolDisplayMap.diamond,
  pirateTreasureTheme.symbolDisplayMap.bar,
  pirateTreasureTheme.symbolDisplayMap.cherry,
  pirateTreasureTheme.symbolDisplayMap.bell,
  pirateTreasureTheme.symbolDisplayMap.horseshoe
] as const;

export const authAccessModeHighlights = ['Sign up now or login', 'You can also play as a guest'] as const;
