import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { UserModel } from '../models/user.model.js';

/**
 * Creates a new user account document.
 *
 * @param {Request} request - Express request containing validated user input.
 * @param {Response} response - Express response used to return the created user.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function createUser(request: Request, response: Response) {
  try {
    const user = new UserModel({
      name: request.body.name,
      displayName: request.body.displayName,
      dateOfBirth: request.body.dateOfBirth,
      email: request.body.email
    });

    user.set('password', request.body.password);

    await user.save();

    response.status(201).json({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      dateOfBirth: user.dateOfBirth,
      email: user.email
    });
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Lists all user documents.
 *
 * @param {Request} _request - Unused Express request object.
 * @param {Response} response - Express response for the user list.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function listUsers(_request: Request, response: Response) {
  try {
    const users = await UserModel.find().select('-passwordHash').lean();

    response.status(200).json(users);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Fetches one user by MongoDB identifier.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the user payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function getUserById(request: Request, response: Response) {
  try {
    const user = await UserModel.findById(request.params.id)
      .select('-passwordHash')
      .lean();

    if (!user) {
      response.status(404).json({ error: 'User not found.' });
      return;
    }

    response.status(200).json(user);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Updates a user document with validated input.
 *
 * @param {Request} request - Express request containing `id` and allowed fields.
 * @param {Response} response - Express response for the updated user.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function updateUser(request: Request, response: Response) {
  try {
    const user = await UserModel.findById(request.params.id);

    if (!user) {
      response.status(404).json({ error: 'User not found.' });
      return;
    }

    if (request.body.name !== undefined) {
      user.name = request.body.name;
    }

    if (request.body.displayName !== undefined) {
      user.displayName = request.body.displayName;
    }

    if (request.body.dateOfBirth !== undefined) {
      user.dateOfBirth = request.body.dateOfBirth;
    }

    if (request.body.email !== undefined) {
      user.email = request.body.email;
    }

    if (request.body.password !== undefined) {
      user.set('password', request.body.password);
    }

    await user.save();

    response.status(200).json({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      dateOfBirth: user.dateOfBirth,
      email: user.email
    });
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Deletes a user document by identifier.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the deletion result.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function deleteUser(request: Request, response: Response) {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(request.params.id).lean();

    if (!deletedUser) {
      response.status(404).json({ error: 'User not found.' });
      return;
    }

    response.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Maps known persistence errors to API responses.
 *
 * @param {unknown} error - Error thrown during controller execution.
 * @param {Response} response - Express response instance.
 * @returns {void}
 */
function handleControllerError(error: unknown, response: Response) {
  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (isDuplicateKeyError(error)) {
    response.status(409).json({ error: 'A user with that email already exists.' });
    return;
  }

  response.status(500).json({ error: 'Unable to process user request.' });
}

/**
 * Checks whether the error is a Mongo duplicate key failure.
 *
 * @param {unknown} error - Unknown thrown error.
 * @returns {boolean} True when the error matches code 11000.
 */
function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}
