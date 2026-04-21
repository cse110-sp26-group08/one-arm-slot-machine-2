import type { Request, Response } from 'express';

import { decodeSessionToken } from '../services/auth-session.service.js';
import {
  getSlotMachineState,
  spinSlotMachine
} from '../services/slot-machine.service.js';

/**
 * Returns the current slot-machine state for the authenticated player.
 *
 * @param {Request} request - Express request containing the bearer token.
 * @param {Response} response - Express response containing the state payload.
 * @returns {void}
 */
export function getCurrentSlotMachineState(request: Request, response: Response) {
  const sessionUser = resolveSessionUser(request);

  if (!sessionUser) {
    response.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  response.status(200).json(getSlotMachineState(sessionUser.id));
}

/**
 * Executes a slot-machine spin for the authenticated player.
 *
 * @param {Request} request - Express request containing the bearer token.
 * @param {Response} response - Express response containing the updated state.
 * @returns {void}
 */
export function spinSlotMachineController(request: Request, response: Response) {
  const sessionUser = resolveSessionUser(request);

  if (!sessionUser) {
    response.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  response.status(200).json(spinSlotMachine(sessionUser.id));
}

/**
 * Resolves the authenticated session user from the bearer token.
 *
 * @param {Request} request - Express request with Authorization header.
 * @returns {{ id: string } | null} Session user identity when valid.
 */
function resolveSessionUser(request: Request) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  return decodeSessionToken(authorizationHeader.slice('Bearer '.length));
}
