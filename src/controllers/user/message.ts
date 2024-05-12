import { NextFunction, Request, Response } from 'express';
import { CREATED, NOT_FOUND, NO_CONTENT, OK } from 'http-status';

import { ConversationSchema, MessageSchema, UserSchema } from '@schemas/index';
import { asyncHandler, customError, multer, utils } from '@scripts/index';
import { tmdbAPI } from '@api/index';
import { MediaMessageProps } from '@schemas/message';
import { tmdbImageURL } from '@constants/index';
import { io } from '@loaders/socket';

const createMediaMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const data = req.body;
      const conversation = await ConversationSchema.findOne({
        uuid: conversationId,
        members: {
          $all: [req.user._id],
        },
      });
      if (!conversation)
        return next(new customError('errors.conversationNotFound', NOT_FOUND));

      const newMessage = await MessageSchema.create({
        ...data,
        conversation: conversation._id,
        sender: req.user._id,
      });
      if (newMessage?.media) {
        const { data } = await tmdbAPI.get<MediaMessageProps>(
          `/${newMessage.media.mediaType}/${newMessage.media.id}`,
        );
        newMessage.media = {
          backdropPath:
            data.backdrop_path && `${tmdbImageURL}${data.backdrop_path}`,
          id: data.id,
          posterPath: data.poster_path && `${tmdbImageURL}${data.poster_path}`,
          title: data.title ?? data.name,
          mediaType: newMessage?.media?.mediaType,
        };
      }
      conversation.lastMessage = newMessage._id;
      await conversation.save();
      return res
        .status(CREATED)
        .json(utils.makeResponseJson('', newMessage, CREATED));
    } catch (err) {
      console.log(err);
    }
  },
);
const replyMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;
    const data = req.body;

    const conversation = await ConversationSchema.findOne({
      uuid: conversationId,
      members: {
        $all: [req.user._id],
      },
    });
    if (!conversation)
      return next(new customError('errors.conversationNotFound', NOT_FOUND));

    const newMessage = await MessageSchema.create({
      ...data,
      conversation: conversation._id,
      sender: req.user._id,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    return res
      .status(CREATED)
      .json(utils.makeResponseJson('', newMessage, CREATED));
  },
);

const createMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;
    const data = req.body;

    const conversation = await ConversationSchema.findOne({
      uuid: conversationId,
      members: {
        $all: [req.user._id],
      },
    });
    if (!conversation)
      return next(new customError('errors.conversationNotFound', NOT_FOUND));

    const newMessage = await MessageSchema.create({
      ...data,
      conversation: conversation._id,
      sender: req.user._id,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    return res
      .status(CREATED)
      .json(utils.makeResponseJson('', newMessage, CREATED));
  },
);

const sendImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params;
    const { _id, uuid: userUUID } = req.user;
    const { imageType, uuid } = req.body;

    const conversation = await ConversationSchema.findOne({
      uuid: conversationId,
      members: {
        $all: [_id],
      },
    });
    if (!conversation)
      return next(new customError('errors.conversationNotFound', NOT_FOUND));

    const {
      Location,
      Key: key,
      ETag,
      Bucket,
    } = await multer.avatarUpload(
      req.file,
      userUUID,
      `Messages/${conversationId}`,
    );

    const newMessage = await MessageSchema.create({
      conversation: conversation._id,
      sender: _id,
      image: { Location, key, ETag, Bucket, imageType },
      uuid,
    });
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    return res
      .status(CREATED)
      .json(utils.makeResponseJson('', newMessage, CREATED));
  },
);
const readAllMessages = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId, receiverId } = req.params;
  const receiver = await UserSchema.findOne({ uuid: receiverId });
  const { _id } = req.user;
  const conversation = await ConversationSchema.findOne({
    uuid: conversationId,
    members: {
      $all: [_id, receiver._id],
    },
  });
  await MessageSchema.updateMany(
    {
      conversation: conversation._id,
      isRead: false,
      sender: receiver._id,
    },
    { isRead: true },
    { new: true },
  );
  return res
    .status(NO_CONTENT)
    .json(utils.makeResponseJson('', null, NO_CONTENT));
});

const Messages = asyncHandler(async (req: Request, res: Response) => {
  try {
    const conversation = await ConversationSchema.findOne({
      uuid: req.params.conversationId,
      members: {
        $all: [req.user._id],
      },
    });
    const conversations = await MessageSchema.find({
      conversation: conversation._id,
    })
      .select('-conversation')
      .populate('reply', 'text')
      .sort({ createdAt: -1 });

    const fetchConversations = await Promise.all(
      conversations?.map(async (conversation) => {
        if (conversation?.media) {
          const { data } = await tmdbAPI.get<MediaMessageProps>(
            `/${conversation?.media?.mediaType}/${conversation?.media?.id}`,
          );
          conversation.media = {
            backdropPath:
              data.backdrop_path && `${tmdbImageURL}${data.backdrop_path}`,
            id: data.id,
            posterPath:
              data.poster_path && `${tmdbImageURL}${data.poster_path}`,
            title: data.title ?? data.name,
            mediaType: conversation.media.mediaType,
          };
        }
        return conversation;
      }),
    );
    const count = await MessageSchema.countDocuments({
      conversation: conversation._id,
    });

    return res
      .status(OK)
      .json(
        utils.makeResponseJson('', { messages: fetchConversations, count }, OK),
      );
  } catch (error) {
    console.log(error.data);
  }
});
export {
  createMessage,
  Messages,
  readAllMessages,
  sendImage,
  createMediaMessage,
  replyMessage,
};
