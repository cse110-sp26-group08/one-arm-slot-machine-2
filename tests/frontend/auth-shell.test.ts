import assert from 'node:assert/strict';
import test from 'node:test';

import { authAccessModeHighlights, loginMarqueeSymbols } from '../../frontend/components/auth/auth-content.js';

test('auth access-mode copy advertises login or signup plus guest play', () => {
  assert.deepEqual([...authAccessModeHighlights], ['Sign up now or login', 'You can also play as a guest']);
});

test('login marquee uses six pirate slot-machine art symbols', () => {
  assert.equal(loginMarqueeSymbols.length, 6);

  for (const symbolDisplay of loginMarqueeSymbols) {
    assert.ok(symbolDisplay.assetUrl);
    assert.ok(symbolDisplay.alt.length > 0);
  }
});
