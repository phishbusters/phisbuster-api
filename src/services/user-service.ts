import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser, UserType, SubscriptionStatus } from '../models/user';
import { UserRepository } from '../repositories/user-repository';
import { envPrivateVars } from '../config/env-vars';
import { IDigitalAsset } from '../models/digital-assset';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async registerCompany(
    username: string,
    password: string,
    companyName: string,
  ): Promise<IUser> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: hashedPassword,
      userType: UserType.company,
      company: {
        companyName,
        subscriptionStatus: SubscriptionStatus.Active,
      },
    });

    this.userRepository.save(user);
    return user;
  }

  async registerClient(username: string, password: string, name: string) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: hashedPassword,
      name,
      userType: UserType.client,
    });

    this.userRepository.save(user);
    return user;
  }

  async updateUser(username: string, newFields: Partial<IUser>) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    for (const [key, value] of Object.entries(newFields)) {
      existingUser.set(key, value);
    }

    this.userRepository.save(existingUser);
    return existingUser;
  }

  async login(username: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('El usuario no existe');
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

  async updateUserAssets(user: IUser, assets: IDigitalAsset[]) {
    // if (!user.company) {
    //   throw new Error('User is not a company');
    // }

    let digitalAssets = user.company!.digitalAssets;
    if (digitalAssets.length > 0) {
      digitalAssets = digitalAssets.concat(assets);
      user.company!.digitalAssets = digitalAssets;
    } else {
      user.company!.digitalAssets = assets;
    }

    return await this.userRepository.save(user);
  }
}
