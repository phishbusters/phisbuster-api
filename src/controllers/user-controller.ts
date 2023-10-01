import express from 'express';
import { UserService } from '../services/user-service';
import authenticated from '../middleware/authenticated';
import { defineBodyRoute } from '../helpers/define-route';
import { Flags, UserType } from '../models/user';

interface UpdateUser {
  userType: UserType;
  flags: Flags;
}

export function UserController(userService: UserService) {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const {
        username,
        password,
        confirmPassword,
        companyName,
        userType,
        name,
      } = req.body;
      if (confirmPassword !== password) {
        return res
          .status(400)
          .send({ message: 'Las contraseñas no coinciden.' });
      }

      // let user;
      // if (userType === UserType.company) {
      const user = await userService.registerCompany(
        username,
        password,
        companyName,
      );
      // } else {
      //   user = await userService.registerClient(username, password, name);
      // }

      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  router.put(
    '/',
    authenticated,
    defineBodyRoute<UpdateUser>(async (req, res) => {
      try {
        const { username } = req.user;
        const { userType, flags } = req.body;
        let user;
        // if (userType.toLowerCase() === UserType.company) {
        let newFields;
        if (flags) {
          newFields = { flags };
        }

        if (newFields) {
          user = await userService.updateUser(username, newFields);
        }
        // }

        res.status(200).json({ user });
      } catch (error: any) {
        res.status(500).send({ message: error.message });
      }
    }),
  );

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const token = await userService.login(username, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  });

  router.post('/subscribe', authenticated, async (req, res) => {
    try {
      const user = req.user;
      const paymentId = await userService.subscribe(user.username);
      res.status(200).json({ paymentId });
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  });

  router.get('/', authenticated, async (req, res) => {
    const { username } = req.user;
    const user = await userService.getUser(username);
    res.status(200).json(user);
  });

  return router;
}
