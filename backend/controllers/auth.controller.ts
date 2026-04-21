import type { Request, Response } from 'express';

import { UserModel } from '../models/user.model.js';
import {
  createSessionToken,
  decodeSessionToken,
  type SessionUserPayload
} from '../services/auth-session.service.js';

/**
 * Creates a new account and immediately starts an authenticated session.
 *
 * @param {Request} request - Express request containing validated signup data.
 * @param {Response} response - Express response used to return the session payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function signup(request: Request, response: Response) {
  try {
    const user = new UserModel({
      name: request.body.name,
      displayName: request.body.displayName,
      dateOfBirth: request.body.dateOfBirth,
      email: request.body.email
    });

    user.set('password', request.body.password);

    await user.save();

    response.status(201).json(createAuthenticatedSessionPayload({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      isGuest: false
    }));
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      response.status(409).json({ error: 'An account with that email already exists.' });
      return;
    }

    response.status(500).json({ error: 'Unable to create account.' });
  }
}

/**
 * Logs a user in using email and password.
 *
 * @param {Request} request - Express request containing validated login data.
 * @param {Response} response - Express response used to return the session payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function login(request: Request, response: Response) {
  const user = await UserModel.findOne({ email: request.body.email });

  if (!user) {
    response.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const passwordMatches = await user.comparePassword(request.body.password);

  if (!passwordMatches) {
    response.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  response.status(200).json(createAuthenticatedSessionPayload({
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    email: user.email,
    isGuest: false
  }));
}

/**
 * Starts a guest-only session.
 *
 * @param {Request} _request - Unused Express request.
 * @param {Response} response - Express response used to return the session payload.
 * @returns {void}
 */
export function loginAsGuest(_request: Request, response: Response) {
  response.status(200).json(createAuthenticatedSessionPayload({
    id: 'guest-session',
    name: 'Guest Player',
    displayName: 'Guest',
    email: null,
    isGuest: true
  }));
}

/**
 * Restores a cached session token when valid.
 *
 * @param {Request} request - Express request with a bearer token.
 * @param {Response} response - Express response used to return the session payload.
 * @returns {void}
 */
export function restoreSession(request: Request, response: Response) {
  const bearerToken = extractBearerToken(request);

  if (!bearerToken) {
    response.status(401).json({ error: 'Authorization token is required.' });
    return;
  }

  const decodedUser = decodeSessionToken(bearerToken);

  if (!decodedUser) {
    response.status(401).json({ error: 'Session token is invalid or expired.' });
    return;
  }

  response.status(200).json(createAuthenticatedSessionPayload(decodedUser));
}

/**
 * Generates the public session response contract.
 *
 * @param {SessionUserPayload} user - User payload that should be encoded into the token.
 * @returns {{ token: string; user: SessionUserPayload }} Session response data.
 */
function createAuthenticatedSessionPayload(user: SessionUserPayload) {
  return {
    token: createSessionToken(user),
    user
  };
}

/**
 * Extracts a bearer token from the Authorization header when present.
 *
 * @param {Request} request - Express request containing the authorization header.
 * @returns {string | null} Raw token if present; otherwise null.
 */
function extractBearerToken(request: Request) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authorizationHeader.slice('Bearer '.length);
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
