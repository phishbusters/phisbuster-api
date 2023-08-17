import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { envPrivateVars } from '../config/env-vars';
import { UserRepository } from '../repositories/user-repository';

const userRepository = new UserRepository();
function authenticated(req: Request, res: Response, next: NextFunction) {
  // Obtener el token de la cabecera 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer XXXX => [1]

  if (!token) {
    return res.status(401).json({ error: 'Not allowed' });
  }

  jwt.verify(token, envPrivateVars.jwtTokenSecret, async (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Token expired or is not valid' });
    }

    const jwt = userPayload as jwt.JwtPayload;
    const user = await userRepository.findByUsername(jwt.username);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated user' });
    }

    req.user = user;
    next();
  });
}

export default authenticated;
