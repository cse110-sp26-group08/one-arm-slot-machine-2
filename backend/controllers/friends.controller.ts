import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { FriendsModel } from '../models/friends.model.js';

/**
 * Creates a friend list document for a user.
 *
 * @param {Request} request - Express request containing validated friend-list data.
 * @param {Response} response - Express response for the created friend list.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function createFriendsList(request: Request, response: Response) {
  try {
    const friendsList = await FriendsModel.create(request.body);
    response.status(201).json(friendsList);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Lists all friend list documents.
 *
 * @param {Request} _request - Unused Express request object.
 * @param {Response} response - Express response for the list payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function listFriendsLists(_request: Request, response: Response) {
  try {
    const friendLists = await FriendsModel.find().lean();
    response.status(200).json(friendLists);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Fetches one friend list by identifier.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the friend list payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function getFriendsListById(request: Request, response: Response) {
  try {
    const friendList = await FriendsModel.findById(request.params.id).lean();

    if (!friendList) {
      response.status(404).json({ error: 'Friends list not found.' });
      return;
    }

    response.status(200).json(friendList);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Updates one friend list document.
 *
 * @param {Request} request - Express request containing a validated `id` and body.
 * @param {Response} response - Express response for the updated friend list.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function updateFriendsList(request: Request, response: Response) {
  try {
    const friendList = await FriendsModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!friendList) {
      response.status(404).json({ error: 'Friends list not found.' });
      return;
    }

    response.status(200).json(friendList);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Deletes one friend list document.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the deletion result.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function deleteFriendsList(request: Request, response: Response) {
  try {
    const friendList = await FriendsModel.findByIdAndDelete(request.params.id).lean();

    if (!friendList) {
      response.status(404).json({ error: 'Friends list not found.' });
      return;
    }

    response.status(200).json({ message: 'Friends list deleted successfully.' });
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Maps known friend-list persistence errors to API responses.
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
    response.status(409).json({ error: 'Friends list already exists for that user.' });
    return;
  }

  response.status(500).json({ error: 'Unable to process friends request.' });
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
