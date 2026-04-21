import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Validates the request body used to create a game record.
 *
 * @param {Request} request - Express request containing game data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateCreateGame(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { player, amountWagered, amountWonLost } = request.body;

  if (!mongoose.isValidObjectId(player)) {
    response.status(400).json({ error: 'Player must be a valid MongoDB identifier.' });
    return;
  }

  if (!isNonNegativeNumber(amountWagered)) {
    response.status(400).json({ error: 'Amount wagered must be a non-negative number.' });
    return;
  }

  if (!isNumber(amountWonLost)) {
    response.status(400).json({ error: 'Amount won or lost must be a number.' });
    return;
  }

  next();
}

/**
 * Validates the request body used to update a game record.
 *
 * @param {Request} request - Express request containing partial game data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateUpdateGame(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const allowedKeys = ['player', 'amountWagered', 'amountWonLost'];

  if (Object.keys(request.body).length === 0) {
    response.status(400).json({ error: 'At least one game field is required.' });
    return;
  }

  if (!Object.keys(request.body).every((key) => allowedKeys.includes(key))) {
    response.status(400).json({ error: 'Request contains unsupported game fields.' });
    return;
  }

  if (request.body.player !== undefined && !mongoose.isValidObjectId(request.body.player)) {
    response.status(400).json({ error: 'Player must be a valid MongoDB identifier.' });
    return;
  }

  if (
    request.body.amountWagered !== undefined &&
    !isNonNegativeNumber(request.body.amountWagered)
  ) {
    response.status(400).json({ error: 'Amount wagered must be a non-negative number.' });
    return;
  }

  if (request.body.amountWonLost !== undefined && !isNumber(request.body.amountWonLost)) {
    response.status(400).json({ error: 'Amount won or lost must be a number.' });
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
export function validateGameId(
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

/**
 * Determines whether the supplied value is numeric.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value is a finite number.
 */
function isNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Determines whether the supplied value is a non-negative number.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value is a non-negative finite number.
 */
function isNonNegativeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
