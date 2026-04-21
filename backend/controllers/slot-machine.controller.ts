import type { Request, Response } from 'express';

import { decodeSessionToken } from '../services/auth-session.service.js';
import {
  getSlotMachineState,
  purchaseSlotMachinePrize,
  setSlotMachineBetAmount,
  type SlotPrizeId,
  SlotMachineStateError,
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

  try {
    response.status(200).json(spinSlotMachine(sessionUser.id));
  } catch (error) {
    if (error instanceof SlotMachineStateError) {
      response.status(400).json({ error: error.message });
      return;
    }

    response.status(500).json({ error: 'Unable to spin the slot machine.' });
  }
}

/**
 * Updates the current slot-machine bet for the authenticated player.
 *
 * @param {Request} request - Express request containing the bearer token and next bet amount.
 * @param {Response} response - Express response containing the updated state.
 * @returns {void}
 */
export function updateSlotMachineBetAmountController(request: Request, response: Response) {
  const sessionUser = resolveSessionUser(request);

  if (!sessionUser) {
    response.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  const nextBetAmount = Number(request.body?.betAmount);

  try {
    response.status(200).json(setSlotMachineBetAmount(sessionUser.id, nextBetAmount));
  } catch (error) {
    if (error instanceof SlotMachineStateError) {
      response.status(400).json({ error: error.message });
      return;
    }

    response.status(500).json({ error: 'Unable to update the bet amount.' });
  }
}

/**
 * Purchases a slot-machine prize for the authenticated player.
 *
 * @param {Request} request - Express request containing the bearer token and prize identifier.
 * @param {Response} response - Express response containing the updated state.
 * @returns {void}
 */
export function purchaseSlotMachinePrizeController(request: Request, response: Response) {
  const sessionUser = resolveSessionUser(request);

  if (!sessionUser) {
    response.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  const prizeId = request.body?.prizeId as SlotPrizeId | undefined;

  try {
    response.status(200).json(purchaseSlotMachinePrize(sessionUser.id, prizeId ?? 'snow-theme'));
  } catch (error) {
    if (error instanceof SlotMachineStateError) {
      response.status(400).json({ error: error.message });
      return;
    }

    response.status(500).json({ error: 'Unable to purchase the selected prize.' });
  }
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
