import mongoose, { Document } from 'mongoose';

export interface IPhishingStat extends Document {
  date: Date;
  phishingChatsDetected: number;
  fakeProfilesDetected: number;
  complaintsExecuted: number;
}

const phishingStatSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  phishingChatsDetected: { type: Number, required: false, default: 0 },
  fakeProfilesDetected: { type: Number, required: false, default: 0 },
  complaintsExecuted: { type: Number, required: false, default: 0 },
});

export const PhishingStat = mongoose.model<IPhishingStat>(
  'PhishingStat',
  phishingStatSchema,
);
