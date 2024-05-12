import { Document, model, Schema, Types } from 'mongoose';
import { v4 } from 'uuid';

enum EType {
  Movie = 'movie',
  TV = 'tv',
  Common = 'common',
}
export type NameProps = {
  tr: string;
  en: string;
};

export interface IGenre extends Document {
  name: NameProps;
  id: number | string;
  registeredUsers: Types.ObjectId[];
  mediaType: EType;
  uuid: string;
}

const GenreSchema: Schema<IGenre> = new Schema(
  {
    name: { type: Object, required: true },
    id: { type: Number, required: true, index: true, unique: true },
    mediaType: {
      type: String,
      required: true,
      enum: Object.values(EType),
    },
    registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },

  { timestamps: true, versionKey: false },
);
GenreSchema.pre('save', function (this: IGenre) {
  this.uuid = v4();
});
export default model<IGenre>('Genre', GenreSchema);
