import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { GameModel } from '../models/game.model.js';

/**
 * Creates a game history record.
 *
 * @param {Request} request - Express request containing validated game data.
 * @param {Response} response - Express response for the created game record.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function createGame(request: Request, response: Response) {
  try {
    const game = await GameModel.create(request.body);
    response.status(201).json(game);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Lists all game records.
 *
 * @param {Request} _request - Unused Express request object.
 * @param {Response} response - Express response for the list payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function listGames(_request: Request, response: Response) {
  try {
    const games = await GameModel.find().lean();
    response.status(200).json(games);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Fetches one game record by identifier.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the game payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function getGameById(request: Request, response: Response) {
  try {
    const game = await GameModel.findById(request.params.id).lean();

    if (!game) {
      response.status(404).json({ error: 'Game not found.' });
      return;
    }

    response.status(200).json(game);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Updates one game record.
 *
 * @param {Request} request - Express request containing a validated `id` and body.
 * @param {Response} response - Express response for the updated game record.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function updateGame(request: Request, response: Response) {
  try {
    const game = await GameModel.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    }).lean();

    if (!game) {
      response.status(404).json({ error: 'Game not found.' });
      return;
    }

    response.status(200).json(game);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Deletes one game record.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the deletion result.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function deleteGame(request: Request, response: Response) {
  try {
    const game = await GameModel.findByIdAndDelete(request.params.id).lean();

    if (!game) {
      response.status(404).json({ error: 'Game not found.' });
      return;
    }

    response.status(200).json({ message: 'Game deleted successfully.' });
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Maps known game persistence errors to API responses.
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

  response.status(500).json({ error: 'Unable to process game request.' });
}
