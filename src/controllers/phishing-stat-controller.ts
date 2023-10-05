import express from 'express';
import authenticated from '../middleware/authenticated';
import { PhishingStatService } from '../services/phishing-stat-service';

export function PhishingStatController(service: PhishingStatService) {
  const router = express.Router();

  router.get('/', authenticated, async (req, res) => {
    try {
      const lastSevenDays = await service.getStatsForLastWeek();
      const sinceCreation = await service.sinceCreation();
      res.status(200).json({ lastSevenDays, sinceCreation });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  });

  return router;
}
