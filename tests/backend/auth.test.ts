import test from 'node:test';
import assert from 'node:assert/strict';

import { login, loginAsGuest, restoreSession, signup } from '../../backend/controllers/auth.controller.js';
import { UserModel } from '../../backend/models/user.model.js';
import { createSessionToken, decodeSessionToken } from '../../backend/services/auth-session.service.js';
import { validateLoginRequest, validateSignupRequest } from '../../backend/validators/auth.validator.js';

test('validateSignupRequest rejects mismatched passwords', () => {
  const response = createResponse();

  validateSignupRequest(
    {
      body: {
        name: 'Jane Player',
        displayName: 'LuckyJane',
        email: 'jane@example.com',
        password: 'slotspin123',
        confirmPassword: 'different123',
        dateOfBirth: '1998-04-16',
        captcha: 'JACKPOT'
      }
    } as never,
    response as never,
    () => {
      throw new Error('next should not be called');
    }
  );

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, { error: 'Confirm password must match password.' });
});

test('validateLoginRequest accepts valid credentials', () => {
  let nextCalled = false;

  validateLoginRequest(
    {
      body: {
        email: 'jane@example.com',
        password: 'slotspin123'
      }
    } as never,
    createResponse() as never,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(nextCalled, true);
});

test('createSessionToken can be decoded into the original public user payload', () => {
  const user = {
    id: '507f1f77bcf86cd799439011',
    name: 'Jane Player',
    displayName: 'LuckyJane',
    email: 'jane@example.com',
    isGuest: false
  };

  const token = createSessionToken(user);

  assert.deepEqual(decodeSessionToken(token), user);
});

test('signup creates a user and returns a signed session payload', async () => {
  const originalSave = UserModel.prototype.save;

  UserModel.prototype.save = async function saveStub() {
    return this;
  };

  const response = createResponse();

  await signup(
    {
      body: {
        name: 'Jane Player',
        displayName: 'LuckyJane',
        email: 'jane@example.com',
        password: 'slotspin123',
        confirmPassword: 'slotspin123',
        dateOfBirth: '1998-04-16',
        captcha: 'JACKPOT'
      }
    } as never,
    response as never
  );

  UserModel.prototype.save = originalSave;

  assert.equal(response.statusCode, 201);
  assert.equal(typeof (response.body as { token: string }).token, 'string');
  assert.equal(
    decodeSessionToken((response.body as { token: string }).token)?.displayName,
    'LuckyJane'
  );
});

test('login returns 401 when no user matches the email', async () => {
  const originalFindOne = UserModel.findOne;

  UserModel.findOne = (async () => null) as typeof UserModel.findOne;

  const response = createResponse();

  await login(
    {
      body: {
        email: 'missing@example.com',
        password: 'slotspin123'
      }
    } as never,
    response as never
  );

  UserModel.findOne = originalFindOne;

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: 'Invalid email or password.' });
});

test('login returns a cached session token when credentials match', async () => {
  const originalFindOne = UserModel.findOne;
  const testUser = new UserModel({
    name: 'Jane Player',
    displayName: 'LuckyJane',
    dateOfBirth: new Date('1998-04-16'),
    email: 'jane@example.com'
  });

  testUser.set('password', 'slotspin123');

  UserModel.findOne = (async () => testUser) as typeof UserModel.findOne;

  const response = createResponse();

  await login(
    {
      body: {
        email: 'jane@example.com',
        password: 'slotspin123'
      }
    } as never,
    response as never
  );

  UserModel.findOne = originalFindOne;

  assert.equal(response.statusCode, 200);
  assert.equal(
    decodeSessionToken((response.body as { token: string }).token)?.email,
    'jane@example.com'
  );
});

test('restoreSession rejects invalid bearer tokens', () => {
  const response = createResponse();

  restoreSession(
    {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    } as never,
    response as never
  );

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: 'Session token is invalid or expired.' });
});

test('loginAsGuest returns a guest identity', () => {
  const response = createResponse();

  loginAsGuest({} as never, response as never);

  assert.equal(response.statusCode, 200);
  assert.equal((response.body as { user: { isGuest: boolean } }).user.isGuest, true);
});

/**
 * Creates a lightweight Express-style response object for controller tests.
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
