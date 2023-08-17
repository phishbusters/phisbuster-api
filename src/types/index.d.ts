import { IUser } from '../models/user';

declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
}

declare module 'jsonwebtoken' {
  interface JwtPayload {
    username: string;
  }
}
