import { Router } from 'express';

import {
  getCurrentSlotMachineState,
  spinSlotMachineController
} from '../controllers/slot-machine.controller.js';

export const slotMachineRouter = Router();

slotMachineRouter.get('/state', getCurrentSlotMachineState);
slotMachineRouter.post('/spin', spinSlotMachineController);
