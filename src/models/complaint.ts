import mongoose from 'mongoose';

export enum ComplaintStatus {
  Created = 'Created',
  Open = 'Open',
  Closed = 'Closed',
  Pending = 'Pending',
}

export interface IComplaint extends Document {
  _id: string;
  status: ComplaintStatus;
  actionRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(ComplaintStatus),
    required: true,
  },
  actionRequired: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: false, default: Date.now() },
  updatedAt: { type: Date, required: false, default: Date.now() },
});

complaintSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

export const Complaint = mongoose.model<IComplaint>(
  'Complaint',
  complaintSchema,
);
