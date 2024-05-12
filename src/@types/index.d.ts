import { Types } from 'mongoose';
import type { IUser } from './schema/user';
type RequestUserProps = {
  _id: Types.ObjectId;
  fullName: string;
  userName: string;
  email: string;
  uuid: string;
};
declare module 'express' {
  export interface Request {
    user: RequestUserProps;
  }
}
declare module 'socket.io' {
  export interface Socket {
    user: IUser;
    uuid: string;
  }
}
import 'replicate';

declare module 'replicate' {}
