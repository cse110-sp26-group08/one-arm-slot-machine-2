import { Router } from 'express';

import {
  createAccountData,
  deleteAccountData,
  getAccountDataById,
  listAccountData,
  updateAccountData
} from '../controllers/account-data.controller.js';
import {
  validateAccountDataId,
  validateCreateAccountData,
  validateUpdateAccountData
} from '../validators/account-data.validator.js';

export const accountDataRouter = Router();

accountDataRouter.get('/', listAccountData);
accountDataRouter.get('/:id', validateAccountDataId, getAccountDataById);
accountDataRouter.post('/', validateCreateAccountData, createAccountData);
accountDataRouter.put(
  '/:id',
  validateAccountDataId,
  validateUpdateAccountData,
  updateAccountData
);
accountDataRouter.delete('/:id', validateAccountDataId, deleteAccountData);
