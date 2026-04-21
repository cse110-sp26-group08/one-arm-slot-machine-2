import assert from 'node:assert/strict';
import test from 'node:test';

import { createConfettiParticles, getWinAnnouncement } from '../../frontend/components/home/celebration.js';
import type { SlotMachineState } from '../../frontend/services/slot-machine-client.js';

test('createConfettiParticles builds the requested number of particles with bounded values', () => {
  const particles = createConfettiParticles(12);

  assert.equal(particles.length, 12);
  assert.ok(particles.every((particle) => particle.horizontalPosition >= 4 && particle.horizontalPosition <= 95));
  assert.ok(particles.every((particle) => particle.sizeInPixels >= 10 && particle.sizeInPixels <= 18));
  assert.ok(particles.every((particle) => particle.durationInMilliseconds >= 1450));
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
    stats: {
      currentBetAmount: 25,
      numberOfSpins: 4,
      totalBalance: 1250
    },
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
