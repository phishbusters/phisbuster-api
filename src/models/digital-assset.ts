import mongoose from 'mongoose';

export enum AssetType {
  Logo = 'Logo',
  Image = 'Image',
  URL = 'URL',
  SocialNetworkUrl = 'SocialNetworkUrl',
  Phone = 'phone',
  Email = 'email',
  PublicFaces = 'PublicFaces',
}

export interface IDigitalAsset extends Document {
  assetId: string;
  assetType: AssetType;
  assetContent: string;
  validationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const digitalAssetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  assetType: { type: String, enum: Object.values(AssetType), required: true },
  assetContent: { type: String, required: true },
  validationStatus: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  updatedAt: { type: Date, required: true, default: Date.now() },
});

digitalAssetSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

export const DigitalAsset = mongoose.model<IDigitalAsset>(
  'DigitalAsset',
  digitalAssetSchema,
);
