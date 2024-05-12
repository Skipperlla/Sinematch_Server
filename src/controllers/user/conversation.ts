import { Request, Response } from 'express';
import { CREATED, NO_CONTENT, OK } from 'http-status';

import { ConversationSchema, UserSchema } from '@schemas/index';
import { asyncHandler, utils } from '@scripts/index';
import { io } from '@loaders/socket';
import _ from 'lodash';

const createConversation = asyncHandler(async (req: Request, res: Response) => {
  const { receiverId } = req.params;
  const { _id } = req.user;
  const receiver = await UserSchema.findOne({ uuid: receiverId });

  const conversationCheck = await ConversationSchema.findOne({
    members: {
      $all: [_id, receiver._id],
    },
  })
    .select('members updatedAt lastMessage uuid discoveryId')
    .populate([
      {
        path: 'members',
        select: 'fullName avatars uuid fcmToken',
      },
      {
        path: 'lastMessage',
        select: 'reply text media image sender createdAt isRead',
      },
    ]);

  if (conversationCheck) {
    conversationCheck.members = conversationCheck.members.filter(
      (member) => member._id.toString() !== _id.toString(),
    );
    return res
      .status(OK)
      .json(utils.makeResponseJson('', conversationCheck, OK));
  }

  const { uuid } = await ConversationSchema.create({
    members: [receiver._id, _id],
    sender: _id,
    receiver: receiver._id,
    ...req.body,
  });
  const conversation = await ConversationSchema.findOne({
    uuid,
    sender: _id,
    receiver: receiver._id,
    members: {
      $all: [_id, receiver._id],
    },
  })
    .select('members updatedAt lastMessage uuid discoveryId')
    .populate([
      {
        path: 'members',
        select: 'fullName avatars uuid fcmToken',
      },
      {
        path: 'lastMessage',
        select: 'reply text media image sender createdAt isRead',
      },
    ]);
  const filteredSender = _.cloneDeep(conversation);
  const filteredReceiver = _.cloneDeep(conversation);

  filteredReceiver.members = conversation.members.filter(
    (member) => member._id.toString() === _id.toString(),
  );
  filteredSender.members = conversation.members.filter(
    (member) => member._id.toString() !== _id.toString(),
  );
  io.to(receiverId).emit('newConversation', filteredReceiver);

  return res
    .status(CREATED)
    .json(utils.makeResponseJson('', filteredSender, CREATED));
});
const endConversation = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId, receiverId } = req.params;
  const conversation = await ConversationSchema.findOne({
    uuid: conversationId,
    members: {
      $all: [req.user._id],
    },
  });
  await conversation.deleteOne();
  io.to(receiverId).emit('endConversation', conversationId);
  return res
    .status(NO_CONTENT)
    .json(utils.makeResponseJson('', undefined, NO_CONTENT));
});

const allConversations = asyncHandler(async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { blocks } = await UserSchema.findById(_id);
  const limit = Number(req.query.limit) || 20;

  const conversations = await ConversationSchema.find({
    members: {
      $nin: blocks,
      $all: [_id],
    },
  })
    .select('members updatedAt lastMessage uuid discoveryId')
    .populate([
      {
        path: 'members',
        select: 'fullName avatars uuid fcmToken',
      },
      {
        path: 'lastMessage',
        select: 'text media image sender isRead createdAt',
      },
    ])
    .sort({
      updatedAt: 1,
    })
    .limit(limit);

  conversations.map((conversation) => {
    conversation.members = conversation.members.filter(
      (member) => member._id.toString() !== _id.toString(),
    );
  });

  const count = await ConversationSchema.countDocuments({
    members: {
      $nin: blocks,
      $all: [_id],
    },
  });

  return res
    .status(OK)
    .json(utils.makeResponseJson('', { conversations, count }, OK));
});

export { createConversation, endConversation, allConversations };
