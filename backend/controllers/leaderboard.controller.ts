import type { Request, Response } from 'express';

import { AccountDataModel } from '../models/account-data.model.js';

/**
 * Lists the top player balances for the public leaderboard.
 *
 * @param {Request} _request - Unused Express request.
 * @param {Response} response - Express response containing leaderboard rows.
 * @returns {Promise<void>} Promise resolved after the response is sent.
 */
export async function listLeaderboard(_request: Request, response: Response) {
  try {
    const leaderboardEntries = await AccountDataModel.find()
      .sort({ currentBalance: -1 })
      .limit(10)
      .populate('currentUser', 'displayName')
      .lean();

    response.status(200).json(
      leaderboardEntries.map((entry, index) => ({
        rank: index + 1,
        balance: entry.currentBalance,
        displayName:
          typeof entry.currentUser === 'object' &&
          entry.currentUser !== null &&
          'displayName' in entry.currentUser
            ? entry.currentUser.displayName
            : 'Unknown player',
        title: index === 0 ? 'Table leader' : 'High roller'
      }))
    );
  } catch {
    response.status(500).json({ error: 'Unable to load the leaderboard.' });
  }
}
