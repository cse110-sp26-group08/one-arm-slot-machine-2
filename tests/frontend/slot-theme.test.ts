import assert from 'node:assert/strict';
import test from 'node:test';

import { pirateTreasureTheme } from '../../frontend/components/home/slot-theme.js';
import type { SlotSymbol } from '../../frontend/services/slot-machine-client.js';

test('pirateTreasureTheme defines a visible display for every slot symbol', () => {
  const symbolKeys: SlotSymbol[] = ['seven', 'diamond', 'bar', 'cherry', 'bell', 'horseshoe', 'wild'];

  for (const symbol of symbolKeys) {
    const symbolDisplay = pirateTreasureTheme.symbolDisplayMap[symbol];

    assert.ok(symbolDisplay);
    assert.ok(symbolDisplay.alt.length > 0);
    assert.ok(symbolDisplay.assetUrl || symbolDisplay.emblemText);
  }
});

test('pirateTreasureTheme uses art assets for six standard symbols and a dedicated wild emblem', () => {
  const assetBackedSymbols = Object.values(pirateTreasureTheme.symbolDisplayMap).filter(
    (symbolDisplay) => symbolDisplay.assetUrl
  );

  assert.equal(assetBackedSymbols.length, 6);
  assert.equal(pirateTreasureTheme.symbolDisplayMap.wild.emblemText, 'WILD');
});
