import { v4 } from 'uuid';
import { Document, model, Schema, Types } from 'mongoose';

import { MessageSchema } from '@schemas/index';
import { multer } from '@scripts/index';

export interface IConversation extends Document {
  members: Types.ObjectId[];
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  uuid: string;
  lastMessage: Types.ObjectId;
  discoveryId: string;
}

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    discoveryId: String,
    uuid: { type: String, index: { unique: true, sparse: true } },
  },

  { timestamps: true, versionKey: false },
);
ConversationSchema.pre('save', function (next) {
  if (this.isModified('lastMessage')) return next();

  this.uuid = v4();
  next();
});
ConversationSchema.pre(
  'deleteOne',
  {
    document: true,
  },
  async function (this: IConversation) {
    const messages = await MessageSchema.find({
      conversation: this._id,
    }).select('image');
    if (messages?.length)
      messages?.map(async (message) => {
        if (message?.image)
          await multer.removeAvatar(
            message?.image?.key,
            message?.image?.Bucket,
          );
      });

    await MessageSchema.deleteMany({ conversation: this._id });
  },
);

export default model<IConversation>('Conversation', ConversationSchema);
