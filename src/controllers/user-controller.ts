import express from 'express';
import { UserService } from '../services/user-service';

export function UserController(userService: UserService) {
  const router = express.Router();

  router.post('/register', (req, res) => {
    try {
      const { username, password } = req.body;
      const user = userService.register(username, password);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.post('/login', (req, res) => {
    try {
      const { username, password } = req.body;
      const user = userService.login(username, password);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  return router;
}
