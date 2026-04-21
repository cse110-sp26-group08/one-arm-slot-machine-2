import express from 'express';
import cors from 'cors';
import { accountDataRouter } from './routes/account-data.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { friendsRouter } from './routes/friends.routes.js';
import { gameRouter } from './routes/game.routes.js';
import { leaderboardRouter } from './routes/leaderboard.routes.js';
import { slotMachineRouter } from './routes/slot-machine.routes.js';
import { userRouter } from './routes/user.routes.js';

export { connectToDatabase, disconnectFromDatabase } from './config/database.js';
export {
  AccountDataModel,
  FriendsModel,
  GameModel,
  UserModel
} from './models/index.js';
export { accountDataRouter } from './routes/account-data.routes.js';
export { authRouter } from './routes/auth.routes.js';
export { friendsRouter } from './routes/friends.routes.js';
export { gameRouter } from './routes/game.routes.js';
export { leaderboardRouter } from './routes/leaderboard.routes.js';
export { slotMachineRouter } from './routes/slot-machine.routes.js';
export { userRouter } from './routes/user.routes.js';

/**
 * Creates the backend Express application and mounts all API routes.
 *
 * @returns {express.Express} Configured Express application instance.
 */
export function createApp() {
  const application = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

  application.use(
    cors({
      origin: frontendOrigin
    })
  );
  application.use(express.json());
  application.use('/api/auth', authRouter);
  application.use('/api/users', userRouter);
  application.use('/api/account-data', accountDataRouter);
  application.use('/api/friends', friendsRouter);
  application.use('/api/games', gameRouter);
  application.use('/api/leaderboard', leaderboardRouter);
  application.use('/api/slot-machine', slotMachineRouter);

  return application;
}
