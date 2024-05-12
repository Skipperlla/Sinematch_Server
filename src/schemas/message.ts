import { v4 } from 'uuid';
import { Document, model, Schema, Types } from 'mongoose';

import { ImageProps } from 'type/schema/user';

export type MediaMessageProps = {
  id?: number;
  mediaType?: string;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  backdropPath?: string;
  posterPath?: string;
};

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  reply?: { _id: Types.ObjectId; media: MediaMessageProps };
  text: string;
  media?: MediaMessageProps;
  image?: ImageProps;
  isRead: boolean;
  uuid: string;
  status: string;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, trim: true },
    reply: { type: Schema.Types.ObjectId, ref: 'Message' },
    media: Object,
    image: Object,
    isRead: { type: Boolean, default: false },
    status: { type: String, default: 'delivered' },
    uuid: { type: String, index: { unique: true, sparse: true } },
  },

  { timestamps: true, versionKey: false },
);
// MessageSchema.pre('save', async function (this: IMessage) {
//   this.uuid = v4();
// });

export default model<IMessage>('Message', MessageSchema);
