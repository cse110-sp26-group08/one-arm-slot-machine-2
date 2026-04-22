import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ENHANCED_LUCK_PRICE,
  fetchPrizeCatalog,
  SOUNDTRACK_PRICE
} from '../../frontend/services/prize-client.js';

test('fetchPrizeCatalog returns the configured prize entries and prices', async () => {
  const prizeCatalog = await fetchPrizeCatalog();

  assert.equal(prizeCatalog.length, 3);
  assert.equal(prizeCatalog[0].price, SOUNDTRACK_PRICE);
  assert.equal(prizeCatalog[1].price, SOUNDTRACK_PRICE);
  assert.equal(prizeCatalog[2].price, ENHANCED_LUCK_PRICE);
  assert.equal(prizeCatalog[0].id, 'black-flag-theme');
  assert.equal(prizeCatalog[1].id, 'pirate-adventure-theme');
  assert.equal(prizeCatalog[2].id, 'enhanced-luck');
});
