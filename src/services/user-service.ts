import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';
import { UserRepository } from '../repositories/user-repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(username: string, password: string): Promise<IUser> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const user = new User({ username, password });
    this.userRepository.save(user);

    return user;
  }

  async login(username: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    if (existingUser.password !== password) {
      throw new Error('Invalid password');
    }

    // Generate a JWT with the username in the payload
    const token = jwt.sign(
      { username: existingUser.username },
      'your-secret-key',
    );

    return token;
  }

  async subscribe(username: string): Promise<string> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    // Simulate setting up a payment
    const paymentId = 'PAYMENT_' + Math.random().toString(36).substr(2, 9);

    return paymentId;
  }
}
