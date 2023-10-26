import mongoose, { Document } from 'mongoose';

export interface IPhishingStat extends Document {
  date: Date;
  phishingChatsDetected: number;
  fakeProfilesDetected: number;
  complaintsClosed: number;
  complaintsCreated: number;
  complaintsInProgress: number;
}

const phishingStatSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  phishingChatsDetected: { type: Number, required: false, default: 0 },
  fakeProfilesDetected: { type: Number, required: false, default: 0 },
  complaintsClosed: { type: Number, required: false, default: 0 },
  complaintsCreated: { type: Number, required: false, default: 0 },
  complaintsInProgress: { type: Number, required: false, default: 0 },
});

export const PhishingStat = mongoose.model<IPhishingStat>(
  'PhishingStat',
  phishingStatSchema,
);
