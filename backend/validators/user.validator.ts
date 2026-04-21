import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * Validates the request body used to create a user.
 *
 * @param {Request} request - Express request containing user data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateCreateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { name, displayName, dateOfBirth, email, password } = request.body;

  if (!isNonEmptyString(name)) {
    response.status(400).json({ error: 'Name is required.' });
    return;
  }

  if (!isNonEmptyString(displayName)) {
    response.status(400).json({ error: 'Display name is required.' });
    return;
  }

  if (!isValidDate(dateOfBirth)) {
    response.status(400).json({ error: 'A valid date of birth is required.' });
    return;
  }

  if (!isValidEmail(email)) {
    response.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  if (!isStrongEnoughPassword(password)) {
    response.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  next();
}

/**
 * Validates the request body used to update a user.
 *
 * @param {Request} request - Express request containing partial user data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateUpdateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const allowedKeys = ['name', 'displayName', 'dateOfBirth', 'email', 'password'];
  const bodyKeys = Object.keys(request.body);

  if (bodyKeys.length === 0) {
    response.status(400).json({ error: 'At least one user field is required.' });
    return;
  }

  if (bodyKeys.some((key) => !allowedKeys.includes(key))) {
    response.status(400).json({ error: 'Request contains unsupported user fields.' });
    return;
  }

  if (request.body.name !== undefined && !isNonEmptyString(request.body.name)) {
    response.status(400).json({ error: 'Name must be a non-empty string.' });
    return;
  }

  if (
    request.body.displayName !== undefined &&
    !isNonEmptyString(request.body.displayName)
  ) {
    response.status(400).json({ error: 'Display name must be a non-empty string.' });
    return;
  }

  if (request.body.dateOfBirth !== undefined && !isValidDate(request.body.dateOfBirth)) {
    response.status(400).json({ error: 'Date of birth must be a valid date.' });
    return;
  }

  if (request.body.email !== undefined && !isValidEmail(request.body.email)) {
    response.status(400).json({ error: 'Email must be a valid email address.' });
    return;
  }

  if (
    request.body.password !== undefined &&
    !isStrongEnoughPassword(request.body.password)
  ) {
    response.status(400).json({ error: 'Password must be at least 8 characters long.' });
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
export function validateMongoId(
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
 * Determines whether the value is a non-empty string.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value is a non-empty string.
 */
function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Determines whether the value is a valid ISO-compatible date input.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value can be parsed into a Date.
 */
function isValidDate(value: unknown) {
  return (
    value instanceof Date ||
    (typeof value === 'string' && !Number.isNaN(new Date(value).getTime()))
  );
}

/**
 * Determines whether the value looks like an email address.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value matches a basic email pattern.
 */
function isValidEmail(value: unknown) {
  return (
    typeof value === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)
  );
}

/**
 * Determines whether the supplied password satisfies minimum requirements.
 *
 * @param {unknown} value - Candidate password input.
 * @returns {boolean} True when the password is acceptable.
 */
function isStrongEnoughPassword(value: unknown) {
  return typeof value === 'string' && value.length >= 8;
}
