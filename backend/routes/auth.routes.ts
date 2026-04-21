import { Router } from 'express';

import {
  login,
  loginAsGuest,
  restoreSession,
  signup
} from '../controllers/auth.controller.js';
import {
  validateLoginRequest,
  validateSignupRequest
} from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post('/signup', validateSignupRequest, signup);
authRouter.post('/login', validateLoginRequest, login);
authRouter.post('/guest', loginAsGuest);
authRouter.get('/session', restoreSession);
