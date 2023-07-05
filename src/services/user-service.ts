import { User } from '../models/user';
import { UserRepository } from '../repositories/user-repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  register(username: string, password: string): User {
    const existingUser = this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const user = new User(username, password);
    this.userRepository.save(user);

    return user;
  }

  login(username: string, password: string): User {
    const existingUser = this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    if (existingUser.password !== password) {
      throw new Error('Invalid password');
    }

    return existingUser;
  }
}
