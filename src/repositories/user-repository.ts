import { User } from '../models/user';

export class UserRepository {
  private users = new Map<string, User>();

  save(user: User): void {
    this.users.set(user.username, user);
  }

  findByUsername(username: string): User | undefined {
    return this.users.get(username);
  }
}
