import assert from 'node:assert/strict';
import test from 'node:test';

import {
  clampAudioVolume,
  createDefaultAudioSettings,
  getSoundtrackOptions,
  resolveWinSoundTier,
  sanitizeAudioSettings
} from '../../frontend/services/celebration-audio.js';
import type { SlotMachineState } from '../../frontend/services/slot-machine-client.js';

test('clampAudioVolume keeps values inside the supported range', () => {
  assert.equal(clampAudioVolume(-0.5), 0);
  assert.equal(clampAudioVolume(0.35), 0.35);
  assert.equal(clampAudioVolume(4), 1);
});

test('sanitizeAudioSettings falls back to defaults and clamps invalid values', () => {
  const defaults = createDefaultAudioSettings();
  const sanitizedSettings = sanitizeAudioSettings({
    musicMuted: true,
    musicVolume: 4,
    soundEffectsVolume: -10
  });

  assert.equal(sanitizedSettings.musicMuted, true);
  assert.equal(sanitizedSettings.musicVolume, 1);
  assert.equal(sanitizedSettings.soundEffectsMuted, defaults.soundEffectsMuted);
  assert.equal(sanitizedSettings.soundEffectsVolume, 0);
});

test('resolveWinSoundTier scales pirate win sounds by payout size', () => {
  const baseState: SlotMachineState = {
    grid: [
      ['seven', 'seven', 'seven'],
      ['bar', 'diamond', 'bar'],
      ['bell', 'cherry', 'bell']
    ],
    lastPayout: 0,
    outcome: 'win',
    prizes: {
      enhancedLuckExpiresAt: null,
      ownedSoundtrackIds: [],
      selectedSoundtrackId: 'default-theme'
    },
    stats: {
      currentBetAmount: 25,
      numberOfSpins: 8,
      totalBalance: 1150
    },
    winCelebrationTheme: 'classic',
    winningLines: []
  };

  assert.equal(resolveWinSoundTier({ ...baseState, lastPayout: 75 }), 'small');
  assert.equal(resolveWinSoundTier({ ...baseState, lastPayout: 200 }), 'medium');
  assert.equal(resolveWinSoundTier({ ...baseState, lastPayout: 600 }), 'jackpot');
});

test('getSoundtrackOptions exposes the default track and both purchasable tracks', () => {
  const soundtrackOptions = getSoundtrackOptions();

  assert.equal(soundtrackOptions.length, 3);
  assert.equal(soundtrackOptions[0].id, 'default-theme');
  assert.equal(soundtrackOptions[1].id, 'black-flag-theme');
  assert.equal(soundtrackOptions[2].id, 'pirate-adventure-theme');
});
