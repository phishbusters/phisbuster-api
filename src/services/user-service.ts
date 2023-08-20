import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/user';
import { UserRepository } from '../repositories/user-repository';
import { envPrivateVars } from '../config/env-vars';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(username: string, password: string): Promise<IUser> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }
    // Encriptar la contraseña
    const saltRounds = 10; // Puedes ajustar este número según tus necesidades
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, password: hashedPassword });
    this.userRepository.save(user);

    return user;
  }

  async login(username: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isCorrectPassword) {
      throw new Error('User does not exist');
    }

    const token = jwt.sign(
      { username: existingUser.username },
      envPrivateVars.jwtTokenSecret,
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

  async getUser(username: string): Promise<IUser> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    return existingUser;
  }
}
