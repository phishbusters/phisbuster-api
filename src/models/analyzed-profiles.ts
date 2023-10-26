import mongoose, { Types } from 'mongoose';

export enum DetectedBy {
  system = 'system',
  user = 'user',
}

export interface IAnalyzedProfile extends Document {
  _id: Types.ObjectId;
  profileId: string;
  confidenceLevel: number;
  analysisDate: Date;
  mostSimilarCompany: string;
  complaintId?: string;
  detectedBy: DetectedBy;
  markAsFalsePositive: boolean;
  userInteractions: {
    interactions: number;
    date: Date;
  }[];
  createdAt: Date;
}

const analyzedProfileSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true },
  confidenceLevel: { type: Number, required: true },
  analysisDate: { type: Date, required: true, default: Date.now() },
  relatedCompanyName: { type: String, required: false, default: '' },
  complaintId: { type: String, required: false, default: '' },
  detectedBy: { type: String, required: true, default: DetectedBy.system },
  markAsFalsePositive: { type: Boolean, required: false, default: false },
  userInteractions: [
    {
      interactions: { type: Number, required: false, default: 0 },
      date: { type: Date, required: false, default: Date.now() },
    },
  ],
  createdAt: { type: Date, required: false, default: Date.now() },
});

export const AnalyzedProfile = mongoose.model<IAnalyzedProfile>(
  'AnalyzedProfile',
  analyzedProfileSchema,
);
