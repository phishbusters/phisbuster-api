import mongoose from 'mongoose';
import { IUser, User } from './user';

export interface IClient extends IUser {
  name: string;
}

const clientSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

User.discriminator<IClient>('Client', clientSchema);
