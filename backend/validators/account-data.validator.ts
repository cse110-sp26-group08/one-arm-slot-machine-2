import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Validates the request body used to create account data.
 *
 * @param {Request} request - Express request containing account data fields.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateCreateAccountData(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const {
    currentUser,
    currentBalance,
    cosmeticCurrency,
    currentDailyStreakCount,
    longestStreakCount
  } = request.body;

  if (!mongoose.isValidObjectId(currentUser)) {
    response.status(400).json({ error: 'Current user must be a valid MongoDB identifier.' });
    return;
  }

  if (!isNonNegativeIntegerOrNumber(currentBalance)) {
    response.status(400).json({ error: 'Current balance must be a non-negative number.' });
    return;
  }

  if (!isNonNegativeIntegerOrNumber(cosmeticCurrency)) {
    response.status(400).json({ error: 'Cosmetic currency must be a non-negative number.' });
    return;
  }

  if (!isNonNegativeIntegerOrNumber(currentDailyStreakCount)) {
    response.status(400).json({ error: 'Current daily streak count must be non-negative.' });
    return;
  }

  if (!isNonNegativeIntegerOrNumber(longestStreakCount)) {
    response.status(400).json({ error: 'Longest streak count must be non-negative.' });
    return;
  }

  next();
}

/**
 * Validates the request body used to update account data.
 *
 * @param {Request} request - Express request containing partial account fields.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateUpdateAccountData(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const allowedKeys = [
    'currentUser',
    'currentBalance',
    'cosmeticCurrency',
    'currentDailyStreakCount',
    'longestStreakCount'
  ];

  if (!hasSupportedKeys(request.body, allowedKeys)) {
    response.status(400).json({ error: 'Request contains unsupported account data fields.' });
    return;
  }

  if (Object.keys(request.body).length === 0) {
    response.status(400).json({ error: 'At least one account data field is required.' });
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
    request.body.currentBalance !== undefined &&
    !isNonNegativeIntegerOrNumber(request.body.currentBalance)
  ) {
    response.status(400).json({ error: 'Current balance must be a non-negative number.' });
    return;
  }

  if (
    request.body.cosmeticCurrency !== undefined &&
    !isNonNegativeIntegerOrNumber(request.body.cosmeticCurrency)
  ) {
    response.status(400).json({ error: 'Cosmetic currency must be a non-negative number.' });
    return;
  }

  if (
    request.body.currentDailyStreakCount !== undefined &&
    !isNonNegativeIntegerOrNumber(request.body.currentDailyStreakCount)
  ) {
    response.status(400).json({ error: 'Current daily streak count must be non-negative.' });
    return;
  }

  if (
    request.body.longestStreakCount !== undefined &&
    !isNonNegativeIntegerOrNumber(request.body.longestStreakCount)
  ) {
    response.status(400).json({ error: 'Longest streak count must be non-negative.' });
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
export function validateAccountDataId(
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
 * Determines whether the supplied value is a non-negative number.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value is a non-negative finite number.
 */
function isNonNegativeIntegerOrNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Determines whether the request body contains only supported fields.
 *
 * @param {Record<string, unknown>} body - Request body payload.
 * @param {string[]} allowedKeys - Keys accepted by the validator.
 * @returns {boolean} True when every key is supported.
 */
function hasSupportedKeys(body: Record<string, unknown>, allowedKeys: string[]) {
  return Object.keys(body).every((key) => allowedKeys.includes(key));
}
