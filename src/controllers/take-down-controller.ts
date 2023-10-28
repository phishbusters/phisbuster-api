import express from 'express';
import authenticated from '../middleware/authenticated';
import { defineBodyRoute } from '../helpers/define-route';
import { TakeDownService } from '../services/take-down-service';
import { IComplaint } from '../models/complaint';

export function TakeDownController(takeDownService: TakeDownService) {
  const router = express.Router();

  //   router.post(
  //     '/',
  //     authenticated,
  //     defineBodyRoute<{}>(async (req, res) => {
  //       res.status(400).send({ message: '' });
  //     }),
  //   );

  router.get(
    '/',
    authenticated,
    defineBodyRoute<IComplaint[]>(async (req, res) => {
      const { company } = req.user;
      if (!company) {
        res.status(400).send({ message: '' });
        return;
      }

      const complaints =
        await takeDownService.getComplaintsWithCompanyOrSimilarName(
          company.companyName,
        );

      res.status(200).send({ complaints });
    }),
  );

  return router;
}
