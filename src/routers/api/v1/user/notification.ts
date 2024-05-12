import { Router } from 'express';

import {
  registerToken,
  sentNotification,
} from '@controllers/user/notification';

const router = Router();

router.post('/registerToken', registerToken);
router.post('/sent/:receiverId', sentNotification);

export default router;
