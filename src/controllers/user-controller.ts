import express from 'express';
import { UserService } from '../services/user-service';

export function UserController(userService: UserService) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userService.register(username, password);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const token = await userService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.post('/subscribe', async (req, res) => {
    try {
      const paymentId = await userService.subscribe(req.user!.username);
      res.status(200).json({ paymentId });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  router.get('/me', (req, res) => {
    // The express-jwt middleware sets req.user to the JWT payload
    res.status(200).json(req.user);
  });

  return router;
}
