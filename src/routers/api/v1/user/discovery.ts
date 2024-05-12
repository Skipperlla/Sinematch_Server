import { Router } from 'express';

import {
  Like,
  Reject,
  Undo,
  Discoveries,
  Ignored,
  Likes,
  deleteDiscovery,
} from '@controllers/user/discovery';
import {
  userExits,
  conversationExits,
  discoveryExits,
} from '@middleware/index';

const router = Router();
// TODO: Maybe Discovery exits
router.post(
  '/like/:receiverId',
  [conversationExits.receiverExits, userExits.likeCountCheck],
  Like,
);
router.post('/reject/:receiverId', conversationExits.receiverExits, Reject);
router.put(
  '/undo/:receiverId/:discoveryId',
  [
    conversationExits.receiverExits,
    discoveryExits.discoveryExits,
    userExits.subscriptionCheck,
  ],
  Undo,
);
router.delete(
  '/:receiverId/:discoveryId',
  [conversationExits.receiverExits, discoveryExits.discoveryExits],
  deleteDiscovery,
);
router.get('/ignored', Ignored);
router.get('/likes', Likes);
router.get('/discoveries', Discoveries);

export default router;
