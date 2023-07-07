import mongoose from 'mongoose';

export enum SubscriptionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface IUser extends mongoose.Document {
  companyName: string;
  username: string;
  password: string;
  subscriptionStatus: SubscriptionStatus;
}

const userSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionStatus: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    required: true,
  },
  digitalAssets: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'DigitalAsset' },
  ],
});

export const User = mongoose.model<IUser>('User', userSchema);
