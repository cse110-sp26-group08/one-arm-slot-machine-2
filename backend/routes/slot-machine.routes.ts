import { Router } from 'express';

import {
  getCurrentSlotMachineState,
  spinSlotMachineController,
  updateSlotMachineBetAmountController
} from '../controllers/slot-machine.controller.js';

export const slotMachineRouter = Router();

slotMachineRouter.get('/state', getCurrentSlotMachineState);
slotMachineRouter.post('/spin', spinSlotMachineController);
slotMachineRouter.post('/bet', updateSlotMachineBetAmountController);
