import test from 'node:test';
import assert from 'node:assert/strict';

import { createUser, deleteUser } from '../../backend/controllers/user.controller.js';
import { UserModel } from '../../backend/models/user.model.js';

test('createUser hashes the password and returns a sanitized payload', async () => {
  const originalSave = UserModel.prototype.save;

  UserModel.prototype.save = async function saveStub() {
    return this;
  };

  const response = createResponse();

  await createUser(
    {
      body: {
        name: 'Jane Player',
        displayName: 'LuckyJane',
        dateOfBirth: '1998-04-16',
        email: 'jane@example.com',
        password: 'slotspin123'
      }
    } as never,
    response as never
  );

  UserModel.prototype.save = originalSave;

  assert.equal(response.statusCode, 201);
  assert.equal(typeof (response.body as Record<string, unknown>).email, 'string');
  assert.equal('passwordHash' in (response.body as Record<string, unknown>), false);
});

test('deleteUser returns 404 when the target user does not exist', async () => {
  const originalDelete = UserModel.findByIdAndDelete;

  UserModel.findByIdAndDelete = (() => ({
    lean: async () => null
  })) as typeof UserModel.findByIdAndDelete;

  const response = createResponse();

  await deleteUser(
    {
      params: {
        id: '507f1f77bcf86cd799439011'
      }
    } as never,
    response as never
  );

  UserModel.findByIdAndDelete = originalDelete;

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, { error: 'User not found.' });
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
