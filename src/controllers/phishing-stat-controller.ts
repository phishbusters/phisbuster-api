import express from 'express';
import authenticated from '../middleware/authenticated';
import { PhishingStatService } from '../services/phishing-stat-service';

export function PhishingStatController(service: PhishingStatService) {
  const router = express.Router();

  router.get('/', authenticated, async (req, res) => {
    try {
      const [
        lastSevenDays,
        sinceCreation,
        detectionAmount,
        falsePositiveAndInteractions,
      ] = await Promise.all([
        service.getStatsForLastWeek(),
        service.sinceCreation(),
        service.getAmountDetectedByActor(),
        service.getFalsePositiveAndInteractions(),
      ]);

      res.status(200).json({
        lastSevenDays,
        sinceCreation,
        detectionAmount,
        falsePositiveAndInteractions,
      });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  });

  return router;
}
