import { asyncHandler } from '@scripts/index';
import utils from '@scripts/utils';
import { Request, Response } from 'express';
import { NO_CONTENT, OK } from 'http-status';
import { Message, getMessaging } from 'firebase-admin/messaging';
import { UserSchema } from '@schemas/index';
import i18next from 'i18next';

const registerToken = asyncHandler(async (req: Request, res: Response) => {
  const receivedToken = req.body.fcmToken;
  await UserSchema.findByIdAndUpdate(
    req.user._id,
    {
      fcmToken: receivedToken,
    },
    { new: true },
  );
  return res
    .status(NO_CONTENT)
    .json(utils.makeResponseJson('', null, NO_CONTENT));
});
const sentNotification = asyncHandler(async (req: Request, res: Response) => {
  const { useTranslation, notificationType } = req.body;
  const user = await UserSchema.findById(req.user._id).select('fullName');
  const receiver = await UserSchema.findOne({
    uuid: req.params.receiverId,
  }).select('notifications fcmToken fullName appLanguage');
  const title = req.body.notification.title;
  const body = req.body.notification.body;
  const data = req.body.data;

  const message: Message = {
    notification: {
      title: useTranslation
        ? i18next.t(title, {
            lng: receiver.appLanguage,
          })
        : title,
      body: useTranslation
        ? i18next.t(body, {
            lng: receiver.appLanguage,
            fullName: user.fullName,
          })
        : body,
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
      },
    },

    token: receiver.fcmToken,
    data: data,
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };
  if (!receiver.fcmToken || !receiver.notifications[notificationType])
    return res
      .status(NO_CONTENT)
      .json(utils.makeResponseJson('', null, NO_CONTENT));
  console.log('message', message);
  return getMessaging()
    .send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return res
        .status(NO_CONTENT)
        .json(utils.makeResponseJson('', null, NO_CONTENT));
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

export { registerToken, sentNotification };
