import assert from 'node:assert/strict';
import test from 'node:test';

import { createCelebrationParticles, getWinAnnouncement } from '../../frontend/components/home/celebration.js';
import type { SlotMachineState } from '../../frontend/services/slot-machine-client.js';

test('createCelebrationParticles builds classic confetti with bounded values', () => {
  const particles = createCelebrationParticles('classic', 12);

  assert.equal(particles.length, 12);
  assert.ok(particles.every((particle) => particle.horizontalPosition >= 4 && particle.horizontalPosition <= 95));
  assert.ok(particles.every((particle) => particle.sizeInPixels >= 10 && particle.sizeInPixels <= 18));
  assert.ok(particles.every((particle) => particle.durationInMilliseconds >= 1450));
});

test('createCelebrationParticles builds slower snow particles for the snow theme', () => {
  const particles = createCelebrationParticles('snow', 8);

  assert.equal(particles.length, 8);
  assert.ok(particles.every((particle) => particle.sizeInPixels >= 8 && particle.sizeInPixels <= 17));
  assert.ok(particles.every((particle) => particle.durationInMilliseconds >= 2500));
});

test('getWinAnnouncement summarizes the payout and winning lines', () => {
  const winningState: SlotMachineState = {
    grid: [
      ['seven', 'seven', 'seven'],
      ['bar', 'diamond', 'bar'],
      ['bell', 'cherry', 'bell']
    ],
    lastPayout: 250,
    outcome: 'win',
    prizes: {
      enhancedLuckExpiresAt: null,
      ownedSoundtrackIds: [],
      selectedSoundtrackId: 'default-theme'
    },
    stats: {
      currentBetAmount: 25,
      numberOfSpins: 4,
      totalBalance: 1250
    },
    winCelebrationTheme: 'classic',
    winningLines: [
      {
        matchingCount: 3,
        path: [0, 0, 0],
        paylineIndex: 0,
        payout: 250,
        symbol: 'seven'
      }
    ]
  };

  assert.equal(getWinAnnouncement(winningState), 'You win! 1 payline paid out 250.');
});
