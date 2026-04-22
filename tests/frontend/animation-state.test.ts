import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveNearMissPositionKeys,
  resolveSlotMachineAnimationState,
  resolveWinAnimationTier
} from '../../frontend/components/home/animation-state.js';
import type { SlotMachineState } from '../../frontend/services/slot-machine-client.js';

function createBaseState(overrides: Partial<SlotMachineState> = {}): SlotMachineState {
  return {
    grid: [
      ['seven', 'bar', 'cherry'],
      ['bar', 'diamond', 'bell'],
      ['bell', 'horseshoe', 'wild']
    ],
    lastPayout: 0,
    outcome: 'loss',
    prizes: {
      enhancedLuckExpiresAt: null,
      ownedSoundtrackIds: [],
      selectedSoundtrackId: 'default-theme'
    },
    stats: {
      currentBetAmount: 25,
      numberOfSpins: 0,
      totalBalance: 1000
    },
    winCelebrationTheme: 'classic',
    winningLines: [],
    ...overrides
  };
}

test('resolveSlotMachineAnimationState keeps the machine calm before any spins', () => {
  assert.equal(resolveSlotMachineAnimationState(createBaseState(), false), 'idle');
});

test('resolveSlotMachineAnimationState prioritizes spinning and near-miss states', () => {
  assert.equal(resolveSlotMachineAnimationState(createBaseState(), true), 'spinning');
  assert.equal(
    resolveSlotMachineAnimationState(
      createBaseState({
        outcome: 'near-miss',
        stats: {
          currentBetAmount: 25,
          numberOfSpins: 3,
          totalBalance: 900
        }
      }),
      false
    ),
    'near-miss'
  );
});

test('resolveWinAnimationTier escalates big wins and jackpots', () => {
  assert.equal(resolveWinAnimationTier(createBaseState({ outcome: 'win', lastPayout: 125 })), 'win');
  assert.equal(resolveWinAnimationTier(createBaseState({ outcome: 'win', lastPayout: 225 })), 'big-win');
  assert.equal(resolveWinAnimationTier(createBaseState({ outcome: 'win', lastPayout: 625 })), 'jackpot');
});

test('resolveNearMissPositionKeys highlights the first two symbols of a broken payline', () => {
  const nearMissKeys = resolveNearMissPositionKeys([
    ['seven', 'bar', 'cherry'],
    ['diamond', 'seven', 'bell'],
    ['bell', 'horseshoe', 'bar']
  ]);

  assert.deepEqual(nearMissKeys.sort(), ['0-0', '1-1']);
});

test('resolveNearMissPositionKeys supports wild-assisted near misses without marking full wins', () => {
  const nearMissKeys = resolveNearMissPositionKeys([
    ['wild', 'bar', 'cherry'],
    ['diamond', 'seven', 'bell'],
    ['bell', 'horseshoe', 'seven']
  ]);

  assert.deepEqual(nearMissKeys.sort(), ['0-0', '0-1']);
});
