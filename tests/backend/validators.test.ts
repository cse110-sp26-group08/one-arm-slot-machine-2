import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';

import {
  validateCreateAccountData,
  validateUpdateAccountData
} from '../../backend/validators/account-data.validator.js';
import {
  validateCreateFriends,
  validateFriendsId
} from '../../backend/validators/friends.validator.js';
import {
  validateCreateGame,
  validateUpdateGame
} from '../../backend/validators/game.validator.js';
import {
  validateCreateUser,
  validateMongoId,
  validateUpdateUser
} from '../../backend/validators/user.validator.js';

test('validateCreateUser accepts a complete user payload', () => {
  let nextCalled = false;

  validateCreateUser(
    createRequest({
      body: {
        name: 'Jane Player',
        displayName: 'LuckyJane',
        dateOfBirth: '1998-04-16',
        email: 'jane@example.com',
        password: 'slotspin123'
      }
    }),
    createResponse(),
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

test('validateUpdateUser rejects unsupported fields', () => {
  const response = createResponse();

  validateUpdateUser(
    createRequest({
      body: {
        unsupported: true
      }
    }),
    response,
    () => {
      throw new Error('next should not be called');
    }
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: 'Request contains unsupported user fields.'
  });
});

test('validateMongoId rejects invalid object ids', () => {
  const response = createResponse();

  validateMongoId(
    createRequest({
      params: {
        id: 'not-an-id'
      }
    }),
    response,
    () => {
      throw new Error('next should not be called');
    }
  );

  assert.equal(response.statusCode, 400);
});

test('validateCreateAccountData rejects negative balances', () => {
  const response = createResponse();

  validateCreateAccountData(
    createRequest({
      body: {
        currentUser: new mongoose.Types.ObjectId().toString(),
        currentBalance: -10,
        cosmeticCurrency: 0,
        currentDailyStreakCount: 0,
        longestStreakCount: 0
      }
    }),
    response,
    () => {
      throw new Error('next should not be called');
    }
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: 'Current balance must be a non-negative number.'
  });
});

test('validateUpdateAccountData accepts partial valid updates', () => {
  let nextCalled = false;

  validateUpdateAccountData(
    createRequest({
      body: {
        cosmeticCurrency: 25
      }
    }),
    createResponse(),
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

test('validateCreateFriends accepts valid user and friend ids', () => {
  let nextCalled = false;

  validateCreateFriends(
    createRequest({
      body: {
        currentUser: new mongoose.Types.ObjectId().toString(),
        friends: [
          new mongoose.Types.ObjectId().toString(),
          new mongoose.Types.ObjectId().toString()
        ]
      }
    }),
    createResponse(),
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

test('validateFriendsId rejects invalid ids', () => {
  const response = createResponse();

  validateFriendsId(
    createRequest({
      params: {
        id: 'bad'
      }
    }),
    response,
    () => {
      throw new Error('next should not be called');
    }
  );

  assert.equal(response.statusCode, 400);
});

test('validateCreateGame rejects invalid wager values', () => {
  const response = createResponse();

  validateCreateGame(
    createRequest({
      body: {
        player: new mongoose.Types.ObjectId().toString(),
        amountWagered: -1,
        amountWonLost: 5
      }
    }),
    response,
    () => {
      throw new Error('next should not be called');
    }
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: 'Amount wagered must be a non-negative number.'
  });
});

test('validateUpdateGame accepts partial numeric updates', () => {
  let nextCalled = false;

  validateUpdateGame(
    createRequest({
      body: {
        amountWonLost: -50
      }
    }),
    createResponse(),
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

/**
 * Creates a lightweight Express-style request object for middleware tests.
 *
 * @param {{ body?: Record<string, unknown>; params?: Record<string, string> }} options - Request shape overrides.
 * @returns {{ body: Record<string, unknown>; params: Record<string, string> }} Mock request object.
 */
function createRequest(options: {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}) {
  return {
    body: options.body ?? {},
    params: options.params ?? {}
  };
}

/**
 * Creates a lightweight Express-style response object for middleware tests.
 *
 * @returns {{ statusCode: number; body: unknown; status(code: number): { json(payload: unknown): void } }} Mock response object.
 */
function createResponse() {
  return {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return {
        json: (payload: unknown) => {
          this.body = payload;
        }
      };
    }
  };
}
