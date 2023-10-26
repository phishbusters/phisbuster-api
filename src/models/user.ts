import mongoose from 'mongoose';
import { IDigitalAsset } from './digital-assset';

export enum UserType {
  company = 'company',
  client = 'client',
}

export enum SubscriptionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface Flags {
  shouldSeeOnboarding: boolean;
}

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  userType: UserType;
  company?: {
    companyName: string;
    subscriptionStatus: SubscriptionStatus;
    digitalAssets: IDigitalAsset[];
    clients: mongoose.Types.ObjectId[];
    authorizationStatus: 'pending' | 'accepted';
    authorizationDocument: {
      url: string;
      expiresAt?: Date;
      data?: {
        address: string;
        phone: string;
        email: string;
        renewalDate: string;
        legalName: string;
        legalTitle: string;
        signatureDataURL: string;
      };
    };
  };
  name?: string;
  flags: Flags;

  isCompany(): boolean;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: Object.values(UserType) },

  company: {
    companyName: { type: String, required: false },
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
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: false,
      },
    ],
    authorizationDocument: {
      url: { type: String, required: false, default: '' },
      expiresAt: { type: Date, required: false },
      data: { type: Object, required: false },
    },
    authorizationStatus: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
  },
  flags: {
    shouldSeeOnboarding: { type: Boolean, required: false, default: true },
  },
  name: { type: String, required: false },
});

userSchema.methods.isCompany = function () {
  return this.userType === UserType.company;
};

export const User = mongoose.model<IUser>('User', userSchema);
