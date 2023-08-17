import express from 'express';
import { UserService } from '../services/user-service';
import authenticated from '../middleware/authenticated';

export function UserController(userService: UserService) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userService.register(username, password);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const token = await userService.login(username, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  router.post('/subscribe', authenticated, async (req, res) => {
    try {
      const user = req.user;
      const paymentId = await userService.subscribe(user.username);
      res.status(200).json({ paymentId });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  router.get('/me', authenticated, (req, res) => {
    const { username, digitalAssets } = req.user;
    res.status(200).json({ username, digitalAssets });
  });

  return router;
}
