import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from '../controllers/user.controller.js';
import {
  validateCreateUser,
  validateMongoId,
  validateUpdateUser
} from '../validators/user.validator.js';

export const userRouter = Router();

userRouter.get('/', listUsers);
userRouter.get('/:id', validateMongoId, getUserById);
userRouter.post('/', validateCreateUser, createUser);
userRouter.put('/:id', validateMongoId, validateUpdateUser, updateUser);
userRouter.delete('/:id', validateMongoId, deleteUser);
