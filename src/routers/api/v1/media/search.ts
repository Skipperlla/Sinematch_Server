import { Router } from 'express';

import {
  Movie,
  Series,
  Multi,
  Genres,
  Popular,
} from '@controllers/media/search';

const router = Router();

router.get('/movie', Movie);
router.get('/series', Series);
router.get('/multi', Multi);
router.get('/genres', Genres);
router.get('/popular', Popular);

export default router;
