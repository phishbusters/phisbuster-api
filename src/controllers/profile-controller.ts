import express from 'express';
import authenticated from '../middleware/authenticated';
import { defineBodyRoute } from '../helpers/define-route';
import { PhishingStatService } from '../services/phishing-stat-service';
import { ProfileService } from '../services/profile-service';

interface ProfileAnalyzeRequestBody {
  screenName: string;
}

export function ProfileController(
  profileService: ProfileService,
  phishingStatService: PhishingStatService,
) {
  const router = express.Router();

  router.post(
    '/analyze',
    authenticated,
    defineBodyRoute<ProfileAnalyzeRequestBody>(async (req, res) => {
      try {
        const { screenName } = req.body;
        const { company } = req.user!;
        if (!screenName) {
          return res.status(400).json({ error: 'No profile sent.' });
        }

        const { predictionLabel, confidence } = await profileService.runModel(
          screenName,
        );

        if (predictionLabel === 'fake') {
          phishingStatService.incrementFakeProfiles(new Date());
          profileService.savePositiveCase(
            screenName,
            confidence.toString(),
            company?.companyName || 'No conocida',
          );
        }

        res.status(200).json({
          prediction: predictionLabel === 'fake' ? 1.0 : 0.0,
          predictionLabel,
          confidence,
        });
      } catch (error: any) {
        res.status(400).send({ message: error.message });
      }
    }),
  );

  return router;
}
