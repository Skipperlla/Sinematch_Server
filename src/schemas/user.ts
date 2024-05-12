import jwt from 'jsonwebtoken';
import { model, Schema } from 'mongoose';

import { Config } from '@config/index';
import {
  EGenders,
  EPlans,
  EMatchTypes,
  EStatus,
  IUser,
  IUserModel,
  EProvider,
} from 'type/schema/user';

const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String, minLength: 3, maxLength: 30, trim: true },
    userName: {
      type: String,
      index: { unique: true, sparse: true },
      validator: (value: string): boolean => {
        return /[^A-Za-z0-9]+/gi.test(value);
      },
      lowercase: true,
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    isCompletedProfile: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: [EProvider.apple, EProvider.google],
    },
    providerId: String,
    notifications: {
      type: Object,
      default: {
        newMessage: true,
        matchRequests: true,
        matchAcceptance: true,
      },
    },

    discoverySettings: {
      type: Object,
      default: {
        ageRange: {
          max: new Date(`12/31/${new Date().getFullYear() - 18}`),
          min: new Date(`12/31/${new Date().getFullYear() - 100}`),
        },
        // genderPreference: EGendersPreferences.BOTH,
        matchType: EMatchTypes.BOTH,
        locationDistance: 10 * 1000,
        // discoverySee: true,
      },
    },
    matchLikeCount: { type: Number, default: 40, min: 0 },
    matchResetCountdown: Date,
    email: {
      type: String,
      minLength: 12,
      lowercase: true,
      trim: true,
      index: { unique: true, sparse: true },
      maxLength: 64,
    },
    info: {
      biography: {
        type: String,
        trim: true,
        maxLength: 200,
      },
      birthday: Date,
      gender: {
        type: Number,
        enum: Object.values(EGenders).filter((status) => {
          return typeof status === 'number';
        }),
      },
    },

    avatars: [Object],
    plan: {
      type: Number,
      default: EPlans.NONE,
      enum: Object.values(EPlans).filter((status) => {
        return typeof status === 'number';
      }),
    },
    favMovies: Array,
    favSeries: Array,
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    blocks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    //TODO: FE'den burasi gonderilcek
    platform: String,
    region: Object,
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
      },
    },
    lastSeen: Date,
    ip: String,
    status: {
      type: Number,
      default: EStatus.OK, //? 1 OK | 2 Warning | 3 Blocked | 4 Ban
      enum: Object.values(EStatus).filter((status) => {
        return typeof status === 'number';
      }),
    },
    fcmToken: String,
    appLanguage: String,
    uuid: String,
  },

  { timestamps: true, versionKey: false },
);

UserSchema.methods.generateJWTToken = function (): string {
  const payload = {
    _id: this._id,
    fullName: this.fullName,
    userName: this.userName,
    email: this.email,
    uuid: this.uuid,
  };
  return jwt.sign(payload, Config.jwt.Secret);
};

UserSchema.index({ location: '2dsphere' });

export default model<IUser, IUserModel>('User', UserSchema);
