import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Validates the request body used to create a friends document.
 *
 * @param {Request} request - Express request containing friend-list data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateCreateFriends(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { currentUser, friends } = request.body;

  if (!mongoose.isValidObjectId(currentUser)) {
    response.status(400).json({ error: 'Current user must be a valid MongoDB identifier.' });
    return;
  }

  if (!Array.isArray(friends) || !friends.every((friendId) => mongoose.isValidObjectId(friendId))) {
    response.status(400).json({ error: 'Friends must be an array of MongoDB identifiers.' });
    return;
  }

  next();
}

/**
 * Validates the request body used to update a friends document.
 *
 * @param {Request} request - Express request containing partial friend-list data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateUpdateFriends(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const allowedKeys = ['currentUser', 'friends'];

  if (Object.keys(request.body).length === 0) {
    response.status(400).json({ error: 'At least one friends field is required.' });
    return;
  }

  if (!Object.keys(request.body).every((key) => allowedKeys.includes(key))) {
    response.status(400).json({ error: 'Request contains unsupported friends fields.' });
    return;
  }

  if (
    request.body.currentUser !== undefined &&
    !mongoose.isValidObjectId(request.body.currentUser)
  ) {
    response.status(400).json({ error: 'Current user must be a valid MongoDB identifier.' });
    return;
  }

  if (
    request.body.friends !== undefined &&
    (!Array.isArray(request.body.friends) ||
      !request.body.friends.every((friendId: unknown) => mongoose.isValidObjectId(friendId)))
  ) {
    response.status(400).json({ error: 'Friends must be an array of MongoDB identifiers.' });
    return;
  }

  next();
}

/**
 * Validates a MongoDB identifier path parameter.
 *
 * @param {Request} request - Express request containing a route `id`.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateFriendsId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    response.status(400).json({ error: 'A valid MongoDB identifier is required.' });
    return;
  }

  next();
}
