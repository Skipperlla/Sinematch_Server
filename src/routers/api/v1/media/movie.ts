import { Router } from 'express';

import {
  Detail,
  Credits,
  externalIDs,
  Images,
  Keywords,
  Recommendations,
  Similar,
  Videos,
  watchProviders,
  nowPlaying,
  Popular,
  topRated,
  Upcoming,
  shortDetail,
} from '@controllers/media/movie';

const router = Router();

router.get('/detail/:movieId', Detail);
router.get('/shortDetail/:movieId', shortDetail);
router.get('/Credits/:movieId', Credits);
router.get('/externalIDs/:movieId', externalIDs);
router.get('/images/:movieId', Images);
router.get('/keywords/:movieId', Keywords);
router.get('/Recommendations/:movieId', Recommendations);
router.get('/similar/:movieId', Similar);
router.get('/videos/:movieId', Videos);
router.get('/watchProviders/:movieId', watchProviders);
router.get('/nowPlaying', nowPlaying);
router.get('/popular', Popular);
router.get('/topRated', topRated);
router.get('/upcoming', Upcoming);

export default router;
