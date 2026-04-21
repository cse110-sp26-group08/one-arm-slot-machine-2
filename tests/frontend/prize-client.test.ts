import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ENHANCED_LUCK_PRICE,
  fetchPrizeCatalog,
  SNOW_THEME_PRICE
} from '../../frontend/services/prize-client.js';

test('fetchPrizeCatalog returns the configured prize entries and prices', async () => {
  const prizeCatalog = await fetchPrizeCatalog();

  assert.equal(prizeCatalog.length, 2);
  assert.equal(prizeCatalog[0].price, ENHANCED_LUCK_PRICE);
  assert.equal(prizeCatalog[1].price, SNOW_THEME_PRICE);
  assert.equal(prizeCatalog[0].id, 'enhanced-luck');
  assert.equal(prizeCatalog[1].id, 'snow-theme');
});
