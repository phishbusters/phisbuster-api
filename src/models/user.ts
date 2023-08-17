import mongoose from 'mongoose';
import { IDigitalAsset } from './digital-assset';

export enum SubscriptionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface IUser extends mongoose.Document {
  companyName: string;
  username: string;
  password: string;
  subscriptionStatus: SubscriptionStatus;
  digitalAssets: IDigitalAsset[];
}

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionStatus: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    required: false,
  },
  digitalAssets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DigitalAsset',
      required: false,
    },
  ],
});

export const User = mongoose.model<IUser>('User', userSchema);
