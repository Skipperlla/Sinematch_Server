import { Router } from 'express';

import {
  createMessage,
  sendImage,
  readAllMessages,
  Messages,
  createMediaMessage,
  replyMessage,
} from '@controllers/user/message';
import { multer } from '@scripts/index';

const router = Router({ mergeParams: true });

router.post('/', createMessage);
router.post('/sendImage', multer.uploadAvatarFilter.single('image'), sendImage);
router.post('/sendMedia', createMediaMessage);
router.put('/replyMessage', replyMessage);
router.get('/', Messages);
router.get('/:receiverId/readAllMessages', readAllMessages);

export default router;
