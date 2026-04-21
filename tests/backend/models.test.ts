import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

import { AccountDataModel } from '../../backend/models/account-data.model.js';
import { FriendsModel } from '../../backend/models/friends.model.js';
import { GameModel } from '../../backend/models/game.model.js';
import { UserModel } from '../../backend/models/user.model.js';

test('UserModel virtual password stores a bcrypt hash instead of plain text', async () => {
  const user = new UserModel({
    name: 'Jane Player',
    displayName: 'LuckyJane',
    dateOfBirth: new Date('1998-04-16'),
    email: 'JANE@EXAMPLE.COM'
  });

  user.set('password', 'plain-text-secret');

  assert.notEqual(user.passwordHash, 'plain-text-secret');
  assert.equal(user.email, 'jane@example.com');
  assert.equal(await user.comparePassword('plain-text-secret'), true);
  assert.equal(await user.comparePassword('wrong-password'), false);
});

test('UserModel requires the schema fields defined by the issue', () => {
  const user = new UserModel({});
  const validationError = user.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.name);
  assert.ok(validationError.errors.displayName);
  assert.ok(validationError.errors.dateOfBirth);
  assert.ok(validationError.errors.email);
  assert.ok(validationError.errors.passwordHash);
});

test('AccountDataModel defaults counters and balance fields to zero', () => {
  const userId = new mongoose.Types.ObjectId();
  const account = new AccountDataModel({
    currentUser: userId
  });

  assert.equal(account.currentBalance, 0);
  assert.equal(account.cosmeticCurrency, 0);
  assert.equal(account.currentDailyStreakCount, 0);
  assert.equal(account.longestStreakCount, 0);
});

test('FriendsModel defaults the friends list to an empty array', () => {
  const userId = new mongoose.Types.ObjectId();
  const friendList = new FriendsModel({
    currentUser: userId
  });

  assert.deepEqual(friendList.friends, []);
});

test('GameModel enforces a non-negative wager and tracks payouts', () => {
  const userId = new mongoose.Types.ObjectId();
  const validGame = new GameModel({
    player: userId,
    amountWagered: 25,
    amountWonLost: -25
  });
  const invalidGame = new GameModel({
    player: userId,
    amountWagered: -1,
    amountWonLost: 10
  });

  assert.equal(validGame.validateSync(), undefined);
  assert.ok(invalidGame.validateSync()?.errors.amountWagered);
});
