import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createIdleAnimationDelay,
  IDLE_ANIMATION_MAX_DELAY_MS,
  IDLE_ANIMATION_MIN_DELAY_MS,
  selectNextIdleSymbolIndex
} from '../../frontend/components/slot/slot-icon-idle.js';

test('createIdleAnimationDelay returns the minimum delay for the lowest random value', () => {
  assert.equal(createIdleAnimationDelay(() => 0), IDLE_ANIMATION_MIN_DELAY_MS);
});

test('createIdleAnimationDelay stays below the configured maximum delay', () => {
  assert.equal(createIdleAnimationDelay(() => 0.999999), IDLE_ANIMATION_MAX_DELAY_MS);
});

test('selectNextIdleSymbolIndex returns -1 when there are no symbols', () => {
  assert.equal(selectNextIdleSymbolIndex(0, -1, () => 0.4), -1);
});

test('selectNextIdleSymbolIndex returns the only available symbol when one exists', () => {
  assert.equal(selectNextIdleSymbolIndex(1, -1, () => 0.8), 0);
});

test('selectNextIdleSymbolIndex avoids repeating the current symbol when possible', () => {
  assert.equal(selectNextIdleSymbolIndex(4, 2, () => 0.5), 3);
});

test('selectNextIdleSymbolIndex can choose a different random symbol directly', () => {
  assert.equal(selectNextIdleSymbolIndex(4, 1, () => 0.9), 3);
});
