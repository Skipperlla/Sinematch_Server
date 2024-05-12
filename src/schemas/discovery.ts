import { v4 } from 'uuid';
import { NextFunction } from 'express';
import { Document, model, Schema } from 'mongoose';

import { UserSchema } from '@schemas/index';
import { EPlans, IUser } from 'type/schema/user';

export enum EStatus {
  LIKE = 1,
  MATCHED = 2,
  UNDO = 3,
  WAITING = 4,
  REJECT = 5,
  NOT_MATCHED = 6,
}

export interface IDiscovery extends Document {
  sender?: IUser;
  receiver?: IUser;
  status?: EStatus;
  receiverStatus?: EStatus;
  senderStatus?: EStatus;
  uuid?: string;
}

const DiscoverySchema: Schema<IDiscovery> = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderStatus: {
      type: Number,
      enum: Object.values(EStatus).filter((status) => {
        return typeof status === 'number';
      }),
    },
    receiverStatus: {
      type: Number,
      enum: Object.values(EStatus).filter((status) => {
        return typeof status === 'number';
      }),
    },
    status: {
      type: Number,
      enum: Object.values(EStatus).filter((status) => {
        return typeof status === 'number';
      }),
      default: EStatus.WAITING,
    },
    uuid: { type: String, index: { unique: true, sparse: true } },
  },

  { timestamps: true, versionKey: false },
);
DiscoverySchema.pre(
  'save',
  async function (this: IDiscovery, next: NextFunction) {
    this.uuid = v4();

    const sender = await UserSchema.findById(this.sender);
    const d1 = new Date(),
      d2 = new Date(d1);

    if (this.senderStatus === EStatus.LIKE && sender.plan === EPlans.NONE) {
      await UserSchema.findByIdAndUpdate(
        this.sender,
        {
          $inc: {
            matchLikeCount: -1,
          },
          matchResetCountdown: !(sender?.matchLikeCount - 1)
            ? new Date(d2.setHours(d1.getHours() + 12))
            : undefined,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      next();
    }
    next();
  },
);
export default model<IDiscovery>('Discovery', DiscoverySchema);
