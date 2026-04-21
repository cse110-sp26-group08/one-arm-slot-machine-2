import express from 'express';

export { connectToDatabase, disconnectFromDatabase } from './config/database.js';
export {
  AccountDataModel,
  FriendsModel,
  GameModel,
  UserModel
} from './models/index.js';
export { accountDataRouter } from './routes/account-data.routes.js';
export { friendsRouter } from './routes/friends.routes.js';
export { gameRouter } from './routes/game.routes.js';
export { userRouter } from './routes/user.routes.js';

/**
 * Creates the backend Express application and mounts all API routes.
 *
 * @returns {express.Express} Configured Express application instance.
 */
export function createApp() {
  const application = express();

  application.use(express.json());
  application.use('/api/users', userRouter);
  application.use('/api/account-data', accountDataRouter);
  application.use('/api/friends', friendsRouter);
  application.use('/api/games', gameRouter);

  return application;
}
