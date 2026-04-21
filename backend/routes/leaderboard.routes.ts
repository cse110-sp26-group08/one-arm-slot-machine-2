import { Router } from 'express';

import { listLeaderboard } from '../controllers/leaderboard.controller.js';

export const leaderboardRouter = Router();

leaderboardRouter.get('/', listLeaderboard);
