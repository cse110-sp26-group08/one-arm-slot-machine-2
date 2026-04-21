import { Router } from 'express';

import {
  createFriendsList,
  deleteFriendsList,
  getFriendsListById,
  listFriendsLists,
  updateFriendsList
} from '../controllers/friends.controller.js';
import {
  validateCreateFriends,
  validateFriendsId,
  validateUpdateFriends
} from '../validators/friends.validator.js';

export const friendsRouter = Router();

friendsRouter.get('/', listFriendsLists);
friendsRouter.get('/:id', validateFriendsId, getFriendsListById);
friendsRouter.post('/', validateCreateFriends, createFriendsList);
friendsRouter.put('/:id', validateFriendsId, validateUpdateFriends, updateFriendsList);
friendsRouter.delete('/:id', validateFriendsId, deleteFriendsList);
