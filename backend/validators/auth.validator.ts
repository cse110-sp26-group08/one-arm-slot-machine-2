import type { NextFunction, Request, Response } from 'express';

/**
 * Validates signup requests against the required login-page contract.
 *
 * @param {Request} request - Express request containing signup data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateSignupRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const {
    name,
    displayName,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    captcha
  } = request.body;

  if (!isNonEmptyString(name)) {
    response.status(400).json({ error: 'Name is required.' });
    return;
  }

  if (!isNonEmptyString(displayName)) {
    response.status(400).json({ error: 'Display name is required.' });
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

  if (password !== confirmPassword) {
    response.status(400).json({ error: 'Confirm password must match password.' });
    return;
  }

  if (!isValidDate(dateOfBirth)) {
    response.status(400).json({ error: 'A valid date of birth is required.' });
    return;
  }

  if (!isCaptchaSolved(captcha)) {
    response.status(400).json({ error: 'Captcha response must be JACKPOT.' });
    return;
  }

  next();
}

/**
 * Validates login requests using email and password.
 *
 * @param {Request} request - Express request containing login data.
 * @param {Response} response - Express response used for validation failures.
 * @param {NextFunction} next - Express continuation callback.
 * @returns {void}
 */
export function validateLoginRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { email, password } = request.body;

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
 * Determines whether the value is a non-empty string.
 *
 * @param {unknown} value - Candidate request value.
 * @returns {boolean} True when the value is a non-empty string.
 */
function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
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
 * Determines whether the simple placeholder captcha has been solved.
 *
 * @param {unknown} value - Candidate captcha response.
 * @returns {boolean} True when the user typed the expected challenge answer.
 */
function isCaptchaSolved(value: unknown) {
  return typeof value === 'string' && value.trim().toUpperCase() === 'JACKPOT';
}
