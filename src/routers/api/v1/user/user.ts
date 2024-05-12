import { Router } from 'express';

import {
  Favorites,
  isLoggedIn,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePrimaryAvatar,
  avatarSequenceChange,
  addGenre,
  deleteGenre,
  addFav,
  removeFav,
  searchUser,
  blockUser,
  unBlockUser,
  Notification,
  discoverySettings,
  Compare,
  matchPercent,
  setLocation,
  getBlockUsers,
  deleteAccount,
  updateInfo,
} from '@controllers/user/user';
import { userExits, authExits, validate, rateLimit } from '@middleware/index';
import { userValidation } from '@validations/index';
import { multer } from '@scripts/index';

const router = Router();

router.get('/isLoggedIn', isLoggedIn);
router.get('/favorites/list/:userId', userExits.userExits, Favorites);
router.get('/compare/:userId', userExits.userExits, Compare);
router.get('/matchPercent/:userId', userExits.userExits, matchPercent);

router.put(
  '/profile/update',
  [validate(userValidation.updateProfileValidation), rateLimit(60 * 1000, 25)],
  updateProfile,
);
router.put(
  '/profile/updateInfo',
  [validate(userValidation.updateInfoValidation), rateLimit(60 * 1000, 25)],
  authExits.ageCheck,
  updateInfo,
);
router.put(
  '/avatar/upload',
  [userExits.userAvatarLengthCheck, multer.uploadAvatarFilter.single('avatar')],
  uploadAvatar,
);
router.delete('/avatar/delete', deleteAvatar);
router.delete('/deleteAccount', deleteAccount);
router.put(
  '/avatar/changePrimary',
  multer.uploadAvatarFilter.single('avatar'),
  changePrimaryAvatar,
);
router.put('/avatar/sequenceChange', avatarSequenceChange);
router.put('/favorites/addGenre', addGenre);
router.delete('/favorites/deleteGenre', deleteGenre);
router.put('/favorites/addFav', addFav);
router.delete('/favorites/removeFav', removeFav);
router.get('/search', searchUser);
router.post('/block', userExits.userExits, blockUser);
router.post('/unblock', userExits.userExits, unBlockUser);
router.get('/blockUsers', getBlockUsers);
router.put('/profile/notification', Notification);
router.put(
  '/profile/discoverySettings',
  validate(userValidation.discoverySettingsValidation),
  discoverySettings,
);
router.post('/profile/location', setLocation);

export default router;
