import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_BET_AMOUNT,
  SLOT_MACHINE_COLUMNS,
  SLOT_MACHINE_ROWS,
  calculatePayout,
  createInitialSlotMachineState,
  createRandomGrid,
  evaluateSpin,
  getSlotMachineState,
  spinSlotMachine
} from '../../backend/services/slot-machine.service.js';

test('createInitialSlotMachineState returns the expected starting stats', () => {
  const initialState = createInitialSlotMachineState();

  assert.equal(initialState.stats.currentBetAmount, DEFAULT_BET_AMOUNT);
  assert.equal(initialState.stats.numberOfSpins, 0);
  assert.equal(initialState.stats.totalBalance, 1000);
  assert.equal(initialState.grid.length, SLOT_MACHINE_ROWS);
  assert.equal(initialState.grid[0].length, SLOT_MACHINE_COLUMNS);
});

test('createRandomGrid generates a 3x3 symbol grid', () => {
  const grid = createRandomGrid();

  assert.equal(grid.length, SLOT_MACHINE_ROWS);
  assert.equal(grid.every((row) => row.length === SLOT_MACHINE_COLUMNS), true);
});

test('calculatePayout rewards rows with three or more consecutive matches from the left', () => {
  const payout = calculatePayout(
    [
      ['seven', 'seven', 'seven'],
      ['bell', 'bell', 'bell'],
      ['bar', 'cherry', 'bar']
    ],
    25
  );

  assert.equal(payout, 450);
});

test('evaluateSpin returns a win with explicit winning lines', () => {
  const evaluatedSpin = evaluateSpin(
    [
      ['seven', 'seven', 'seven'],
      ['bar', 'diamond', 'bar'],
      ['bell', 'cherry', 'bell']
    ],
    25
  );

  assert.equal(evaluatedSpin.outcome, 'win');
  assert.equal(evaluatedSpin.winningLines.length, 1);
  assert.equal(evaluatedSpin.winningLines[0].matchingCount, 3);
});

test('evaluateSpin marks near misses when a line starts with two matching symbols', () => {
  const evaluatedSpin = evaluateSpin(
    [
      ['seven', 'diamond', 'bar'],
      ['bar', 'seven', 'horseshoe'],
      ['bar', 'cherry', 'bell']
    ],
    25
  );

  assert.equal(evaluatedSpin.outcome, 'near-miss');
  assert.equal(evaluatedSpin.payout, 0);
});

test('spinSlotMachine updates spins and keeps session state per player', () => {
  const initialState = getSlotMachineState('player-1');
  const spunState = spinSlotMachine('player-1');

  assert.equal(initialState.stats.numberOfSpins, 0);
  assert.equal(spunState.stats.numberOfSpins, 1);
  assert.equal(getSlotMachineState('player-1').stats.numberOfSpins, 1);
});
