import mongoose from 'mongoose';

export enum UserType {
  company = 'company',
  client = 'client',
}

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  userType: UserType;

  isCompany(): boolean;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: Object.values(UserType) },
});

userSchema.methods.isCompany = function () {
  return this.userType === UserType.company;
};

export const User = mongoose.model<IUser>('User', userSchema);
