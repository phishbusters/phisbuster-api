import mongoose from 'mongoose';
import { IDigitalAsset } from './digital-assset';
import { IUser, User } from './user';

export enum SubscriptionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface ICompany extends IUser {
  companyName: string;
  subscriptionStatus: SubscriptionStatus;
  digitalAssets: IDigitalAsset[];
  clients: mongoose.Types.ObjectId[];
}

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  subscriptionStatus: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    required: true,
  },
  digitalAssets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DigitalAsset',
      required: true,
    },
  ],
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },
  ],
});

User.discriminator<ICompany>('Company', companySchema);
