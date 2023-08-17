import mongoose, { Schema, Document } from 'mongoose';

export enum SocialNetwork {
  Facebook = 'facebook',
  Instagram = 'instagram',
  Twitter = 'twitter',
}

export interface IPositiveChatCase extends Document {
  affectedUserId: string;
  scammerUserId: string;
  socialNetwork: SocialNetwork;
  createdAt: Date;
}

const PositiveCaseSchema: Schema = new Schema({
  affectedUserId: { type: String },
  scammerUserId: { type: String },
  socialNetwork: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const PositiveChatCase = mongoose.model<IPositiveChatCase>(
  'PositiveChatCase',
  PositiveCaseSchema,
);
