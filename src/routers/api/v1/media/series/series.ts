import { Router } from 'express';

import {
  Detail,
  Credits,
  externalIDs,
  Images,
  Recommendations,
  Similar,
  Videos,
  Popular,
  topRated,
  shortDetail,
} from '@controllers/media/tv/series';

const router = Router();

router.get('/detail/:tvId', Detail);
router.get('/shortDetail/:tvId', shortDetail);
router.get('/credits/:tvId', Credits);
router.get('/externalIDs/:tvId', externalIDs);
router.get('/images/:tvId', Images);
router.get('/recommendations/:tvId', Recommendations);
router.get('/similar/:tvId', Similar);
router.get('/videos/:tvId', Videos);
router.get('/popular', Popular);
router.get('/topRated', topRated);

export default router;
