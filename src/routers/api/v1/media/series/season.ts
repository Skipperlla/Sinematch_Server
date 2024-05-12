import { Detail, Credits, Images, Videos } from '@controllers/media/tv/season';

import { Router } from 'express';

const router = Router({
  mergeParams: true,
});

router.get('/detail', Detail);
router.get('/credits', Credits);
router.get('/images', Images);
router.get('/videos', Videos);

export default router;
