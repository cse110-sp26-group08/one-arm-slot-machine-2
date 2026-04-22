import type { Request, Response } from 'express';

import { AccountDataModel } from '../models/account-data.model.js';
import { decodeSessionToken } from '../services/auth-session.service.js';
import {
  getSlotMachineState,
  purchaseSlotMachinePrize,
  setSlotMachineSoundtrack,
  setSlotMachineBetAmount,
  type SoundtrackId,
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

  void respondWithHydratedState(sessionUser, response);
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
    void respondWithSyncedState(sessionUser, spinSlotMachine(sessionUser.id), response);
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
    void respondWithSyncedState(
      sessionUser,
      setSlotMachineBetAmount(sessionUser.id, nextBetAmount),
      response
    );
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
    void respondWithSyncedState(
      sessionUser,
      purchaseSlotMachinePrize(sessionUser.id, prizeId ?? 'enhanced-luck'),
      response
    );
  } catch (error) {
    if (error instanceof SlotMachineStateError) {
      response.status(400).json({ error: error.message });
      return;
    }

    response.status(500).json({ error: 'Unable to purchase the selected prize.' });
  }
}

/**
 * Selects the active soundtrack for the authenticated player.
 *
 * @param {Request} request - Express request containing the bearer token and soundtrack id.
 * @param {Response} response - Express response containing the updated state.
 * @returns {void}
 */
export function setSlotMachineSoundtrackController(request: Request, response: Response) {
  const sessionUser = resolveSessionUser(request);

  if (!sessionUser) {
    response.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  const soundtrackId = request.body?.soundtrackId as SoundtrackId | undefined;

  try {
    void respondWithSyncedState(
      sessionUser,
      setSlotMachineSoundtrack(sessionUser.id, soundtrackId ?? 'default-theme'),
      response
    );
  } catch (error) {
    if (error instanceof SlotMachineStateError) {
      response.status(400).json({ error: error.message });
      return;
    }

    response.status(500).json({ error: 'Unable to switch the soundtrack.' });
  }
}

async function respondWithHydratedState(
  sessionUser: { id: string; isGuest?: boolean },
  response: Response
) {
  try {
    const currentState = getSlotMachineState(sessionUser.id);
    const hydratedState = await hydratePersistentBalance(sessionUser, currentState);
    response.status(200).json(hydratedState);
  } catch {
    response.status(500).json({ error: 'Unable to load slot machine state.' });
  }
}

async function respondWithSyncedState(
  sessionUser: { id: string; isGuest?: boolean },
  state: ReturnType<typeof getSlotMachineState>,
  response: Response
) {
  try {
    const syncedState = await syncPersistentBalance(sessionUser, state);
    response.status(200).json(syncedState);
  } catch {
    response.status(500).json({ error: 'Unable to sync slot machine state.' });
  }
}

async function hydratePersistentBalance(
  sessionUser: { id: string; isGuest?: boolean },
  state: ReturnType<typeof getSlotMachineState>
) {
  if (sessionUser.isGuest) {
    return state;
  }

  const accountData = await AccountDataModel.findOne({
    currentUser: sessionUser.id
  }).lean() as { currentBalance: number } | null;

  if (!accountData) {
    return state;
  }

  state.stats.totalBalance = accountData.currentBalance;
  return state;
}

async function syncPersistentBalance(
  sessionUser: { id: string; isGuest?: boolean },
  state: ReturnType<typeof getSlotMachineState>
) {
  if (sessionUser.isGuest) {
    return state;
  }

  await AccountDataModel.findOneAndUpdate(
    { currentUser: sessionUser.id },
    { currentBalance: state.stats.totalBalance },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return state;
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
