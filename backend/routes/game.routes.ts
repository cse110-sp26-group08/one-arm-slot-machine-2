import { Router } from 'express';

import {
  createGame,
  deleteGame,
  getGameById,
  listGames,
  updateGame
} from '../controllers/game.controller.js';
import {
  validateCreateGame,
  validateGameId,
  validateUpdateGame
} from '../validators/game.validator.js';

export const gameRouter = Router();

gameRouter.get('/', listGames);
gameRouter.get('/:id', validateGameId, getGameById);
gameRouter.post('/', validateCreateGame, createGame);
gameRouter.put('/:id', validateGameId, validateUpdateGame, updateGame);
gameRouter.delete('/:id', validateGameId, deleteGame);
