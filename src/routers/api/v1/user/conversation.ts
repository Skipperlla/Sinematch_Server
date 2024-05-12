import { Router } from 'express';

import {
  createConversation,
  endConversation,
  allConversations,
} from '@controllers/user/conversation';
import { conversationExits } from '@middleware/index';

const router = Router();

router.post(
  '/:receiverId',
  conversationExits.receiverExits,
  createConversation,
);
router.delete(
  '/:receiverId/:conversationId',
  conversationExits.conversationExits,
  endConversation,
);
router.get('/', allConversations);

export default router;
