import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCelebrationParticles,
  getCelebrationEyebrow,
  getCelebrationHeadline,
  getWinAnnouncement
} from '../../frontend/components/home/celebration.js';
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

test('getCelebrationHeadline escalates the overlay headline by win tier', () => {
  assert.equal(getCelebrationHeadline('win'), 'You win!');
  assert.equal(getCelebrationHeadline('big-win'), 'Big win!');
  assert.equal(getCelebrationHeadline('jackpot'), 'Jackpot!');
});

test('getCelebrationEyebrow keeps a distinct accent label for larger wins', () => {
  assert.equal(getCelebrationEyebrow('win'), 'Jackpot lights');
  assert.equal(getCelebrationEyebrow('big-win'), 'High tide payout');
  assert.equal(getCelebrationEyebrow('jackpot'), 'Treasure vault open');
});
