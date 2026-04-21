import type { Request, Response } from 'express';
import mongoose from 'mongoose';

import { AccountDataModel } from '../models/account-data.model.js';

/**
 * Creates account data for a user.
 *
 * @param {Request} request - Express request containing validated account data.
 * @param {Response} response - Express response for the created account record.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function createAccountData(request: Request, response: Response) {
  try {
    const accountData = await AccountDataModel.create(request.body);
    response.status(201).json(accountData);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Lists all account data records.
 *
 * @param {Request} _request - Unused Express request object.
 * @param {Response} response - Express response for the list payload.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function listAccountData(_request: Request, response: Response) {
  try {
    const records = await AccountDataModel.find().lean();
    response.status(200).json(records);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Fetches one account data record by identifier.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the fetched account record.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function getAccountDataById(request: Request, response: Response) {
  try {
    const accountData = await AccountDataModel.findById(request.params.id).lean();

    if (!accountData) {
      response.status(404).json({ error: 'Account data not found.' });
      return;
    }

    response.status(200).json(accountData);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Updates one account data record.
 *
 * @param {Request} request - Express request containing a validated `id` and body.
 * @param {Response} response - Express response for the updated record.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function updateAccountData(request: Request, response: Response) {
  try {
    const accountData = await AccountDataModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!accountData) {
      response.status(404).json({ error: 'Account data not found.' });
      return;
    }

    response.status(200).json(accountData);
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Deletes one account data record.
 *
 * @param {Request} request - Express request containing a validated `id` param.
 * @param {Response} response - Express response for the deletion result.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function deleteAccountData(request: Request, response: Response) {
  try {
    const accountData = await AccountDataModel.findByIdAndDelete(request.params.id).lean();

    if (!accountData) {
      response.status(404).json({ error: 'Account data not found.' });
      return;
    }

    response.status(200).json({ message: 'Account data deleted successfully.' });
  } catch (error) {
    handleControllerError(error, response);
  }
}

/**
 * Maps known account-data persistence errors to API responses.
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
    response.status(409).json({ error: 'Account data already exists for that user.' });
    return;
  }

  response.status(500).json({ error: 'Unable to process account data request.' });
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
