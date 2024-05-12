import { loaders } from '@loaders/index';
import { Config } from '@config/index';
import { allConversations } from '@controllers/user/conversation';
import { ConversationSchema, UserSchema } from '@schemas/index';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import Socket, { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { app, server } from 'src/main';
import httpStatus from 'http-status';

let users = [];
export let io: Socket.Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap
>;

export default function () {
  io = new Server(server, {
    cors: {
      origin: '',
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
  });
  // app.set('io', io);
  // io.listen(8000, {
  //   cors: {
  //     origin: ['http://localhost:19006'],
  //   },
  // });
  const addUser = (userId: string, socketId: string) => {
    users.push({ userId, socketId });

    return (users = _.uniqBy(users, 'userId'));
  };

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  // io.use(async (socket, next) => {
  //   const { uuid, accessToken } = socket.handshake.auth;
  //   const user = await UserSchema.findOne({ uuid }).select('uuid blocks');
  //   console.log(user);
  //   if (!uuid) {
  //     return next(new Error('invalid token'));
  //   }
  //   socket.user = user;
  //   next();
  // });
  io.use(async (socket, next) => {
    const uuid = socket.handshake.auth.uuid;
    const user = await UserSchema.findOne({ uuid });
    const hasUser = users.find((user) => user.userId === uuid);
    console.log('hasUser', hasUser);
    if (hasUser) return next(new Error(String(httpStatus.CONFLICT)));
    if (!user) return next(new Error('invalid user'));
    socket.uuid = uuid;
    next();
  });

  io.on('connection', async (socket: Socket.Socket) => {
    addUser(socket.uuid, socket.id);
    socket.join(socket.uuid);
    const { _id, blocks } = await UserSchema.findOne({ uuid: socket.uuid });
    const conversations = (
      await ConversationSchema.find({
        members: {
          $nin: blocks,
          $all: [_id],
        },
      })
    ).map((conversation) => conversation.uuid);
    io.socketsJoin(conversations);
    // TODO: Just uuid emit olucak şekilde değiştirilecek
    // socket.disconnect();
    socket.on('joinConversation', (conversationId: string) => {
      socket.join(conversationId);
      console.log('joinConversation', socket.uuid);
    });

    socket.on('leaveConversation', (conversationId) => {
      console.log('leaveConversation', socket.uuid);
      socket.leave(conversationId);
    });
    socket.on('blockUser', ({ receiverId, senderId }) => {
      socket.to(receiverId).emit('blockUser', senderId);
      // console.log('leaveConversation', socket.uuid);
    });
    socket.on('forceDisconnect', () => {
      console.log('forceDisconnect');
      socket.disconnect();
    });

    //send and get message
    socket.on('sendMessage', ({ conversationId, message }) => {
      console.log(conversationId, message);
      socket.broadcast.to(conversationId).emit('getMessage', message);
      socket.broadcast.to(conversationId).emit('privateMessage', message);
    });
    socket.on('messageDelivered', (conversationId: string) => {
      socket.broadcast.to(conversationId).emit('messageSeen', conversationId);
    });
    socket.on('isTyping', ({ userId, conversationId, isTyping }) => {
      console.log('isTyping', userId, conversationId);
      socket.broadcast
        .to(conversationId)
        .emit('usersWhoWrote', { isTyping, userId, conversationId });
    });
    console.log('user Connected', users);
    //when disconnect
    socket.on('disconnect', async () => {
      removeUser(socket.id);
      io.socketsLeave(conversations);
      socket.leave(socket.uuid);
      console.log('user disconnect', users);

      // io.emit('getUsers', users);
    });
  });
}
