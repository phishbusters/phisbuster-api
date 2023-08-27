import { IUser, User } from '../models/user';

export class UserRepository {
  async save(user: IUser): Promise<void> {
    await user.save();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username }).select('-password');
  }
}
