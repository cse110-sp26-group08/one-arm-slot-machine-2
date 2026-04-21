import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_BET_AMOUNT,
  SLOT_MACHINE_COLUMNS,
  SLOT_MACHINE_ROWS,
  DEFAULT_BALANCE,
  SlotMachineStateError,
  calculatePayout,
  createInitialSlotMachineState,
  createRandomGrid,
  evaluateSpin,
  getSlotMachineState,
  setSlotMachineBetAmount,
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

test('setSlotMachineBetAmount updates the tracked bet when it fits within balance', () => {
  const updatedState = setSlotMachineBetAmount('player-bet-ok', 40);

  assert.equal(updatedState.stats.currentBetAmount, 40);
  assert.equal(getSlotMachineState('player-bet-ok').stats.currentBetAmount, 40);
});

test('setSlotMachineBetAmount rejects bets that exceed the available balance', () => {
  assert.throws(
    () => setSlotMachineBetAmount('player-bet-too-high', DEFAULT_BALANCE + 1),
    (error: unknown) =>
      error instanceof SlotMachineStateError &&
      error.message === 'Bet amount cannot exceed the available balance.'
  );
});

test('spinSlotMachine rejects a spin when the current bet is higher than the balance', () => {
  const trackedState = getSlotMachineState('player-cannot-spin');
  trackedState.stats.totalBalance = 10;
  trackedState.stats.currentBetAmount = 25;

  assert.throws(
    () => spinSlotMachine('player-cannot-spin'),
    (error: unknown) =>
      error instanceof SlotMachineStateError &&
      error.message === 'Current bet exceeds the remaining balance.'
  );
});
