import { IGenre } from '@schemas/genre';
import { Document, Model, Types } from 'mongoose';
export enum EGenders {
  MALE = 1,
  FEMALE = 2,
  UNSPECIFIED = 3,
}
export enum ERoles {
  USER = 'User',
  ADMIN = 'Admin',
}
export enum EGendersPreferences {
  MALE = 1,
  FEMALE = 2,
  BOTH = 3,
}
export enum EProvider {
  google = 'google',
  apple = 'apple',
}
export enum EMatchTypes {
  MOVIE = 1,
  SERIES = 2,
  BOTH = 3,
}

export enum EPlans {
  NONE = 1,
  PLUS = 2,
  GOLD = 3,
}
export enum EStatus {
  OK = 1,
  WARNING = 2,
  BLOCKED = 3,
  BAN = 4,
}
export type NotificationProps = {
  newMessage: boolean;
  matchRequests: boolean;
  matchAcceptance: boolean;
};
export type DiscoverySettingsProps = {
  ageRange: {
    min: Date;
    max: Date;
  };
  genderPreference: EGendersPreferences;
  matchType: EMatchTypes; // ? 1 = Film, 2 = Dizi, 3 = İkiside
  locationDistance: number;
  // discoverySee: boolean;
};
export type InfoProps = {
  biography?: string;
  birthday: Date;
  gender: EGenders;
};
export type ImageProps = {
  Location: string;
  ETag: string;
  Bucket: string;
  key: string;
  index: number;
  createdAt: Date;
};
export type FavoritesProps = {
  id?: number;
  genreIds?: number[];
  mediaType?: string;
};
export interface IUser extends Document {
  fullName: string;
  userName: string;
  notifications: NotificationProps;
  provider: EProvider;
  providerId: string;
  discoverySettings: DiscoverySettingsProps;
  matchLikeCount: number;
  matchResetCountdown: Date;
  email: string;
  info: InfoProps;
  avatars: ImageProps[];
  plan: EPlans;
  favMovies?: FavoritesProps[];
  favSeries?: FavoritesProps[];
  genres: IGenre[];
  blocks: Types.ObjectId[];
  platform: string;
  //TODO: It will change according to the information coming from the phone.
  region: object;
  //TODO: It will change according to the information coming from the phone.
  uuid: string;
  appLanguage: string;
  lastSeen: Date;
  location: {
    type: string;
    coordinates: number[];
  };
  ip: string;
  status: EStatus;
  fcmToken?: string;
  isCompletedProfile: boolean;
  generateJWTToken: () => string;
}
export interface IUserModel extends Model<IUser> {
  generateJWTToken: () => string;
}

export type UserProps = {
  fullName?: string;
  userName?: string;
  notifications?: NotificationProps;
  provider?: EProvider;
  providerId?: string;
  discoverySettings?: DiscoverySettingsProps;
  matchLikeCount?: number;
  matchResetCountdown?: Date;
  email?: string;
  info?: InfoProps;
  avatars?: ImageProps[];
  plan?: EPlans;
  favMovies?: FavoritesProps[];
  favSeries?: FavoritesProps[];
  genres?: IGenre[];
  blocks?: Types.ObjectId[];
  OTPCode?: string;
  OTPCodeExpire?: Date;
  //TODO: It will change according to the information coming from the phone.
  platform?: string;
  //TODO: It will change according to the information coming from the phone.
  region?: object;
  //TODO: It will change according to the information coming from the phone.

  uuid?: string;
  lastSeen?: Date;
  location?: {
    type: string;
    coordinates: number[];
  };
  logins?: Array<{
    ip: string;
    date: Date;
  }>;
  status?: EStatus;
  isCompletedProfile?: boolean;
  generateJWTToken?: () => string;
  generateOTPCode?: () => number;
};
