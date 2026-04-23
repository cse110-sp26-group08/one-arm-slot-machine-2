import { Router } from 'express';

import { listLeaderboard } from '../controllers/leaderboard.controller.js';

/**
 * Express router for the public leaderboard feed ordered by player balance.
 */
export const leaderboardRouter = Router();

leaderboardRouter.get('/', listLeaderboard);
