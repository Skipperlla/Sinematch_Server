import { Router } from 'express';

import { Register, Logout, loginWithProvider } from '@controllers/user/auth';
import { authValidation } from '@validations/index';

import { rateLimit, validate, security } from '@middleware/index';
import { auth } from '@constants/limit';
import { userExits, authExits } from '@middleware/index';

const router = Router();

router.put(
  '/register',
  [
    security.accessToRoute,
    validate(authValidation.registerValidation),
    authExits.ageCheck,
  ],
  Register,
);

router.get(
  '/logout',
  [security.accessToRoute, userExits.userExitsForHeader],
  Logout,
);
router.post('/loginWithProvider', loginWithProvider);

export default router;
