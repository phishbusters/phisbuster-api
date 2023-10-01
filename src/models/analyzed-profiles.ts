import mongoose from 'mongoose';

export interface IAnalyzedProfile extends Document {
  profileId: string;
  confidenceLevel: number;
  analysisDate: Date;
  mostSimilarCompany: string;
}

const analyzedProfileSchema = new mongoose.Schema({
  profileId: { type: String, required: true, unique: true },
  confidenceLevel: { type: Number, required: true },
  analysisDate: { type: Date, required: true, default: Date.now() },
  relatedCompanyName: { type: String, required: false, default: '' },
});

export const AnalyzedProfile = mongoose.model<IAnalyzedProfile>(
  'AnalyzedProfile',
  analyzedProfileSchema,
);
