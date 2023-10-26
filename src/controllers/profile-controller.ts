import express from 'express';
import authenticated from '../middleware/authenticated';
import { defineBodyRoute } from '../helpers/define-route';
import { PhishingStatService } from '../services/phishing-stat-service';
import { ProfileService } from '../services/profile-service';

interface ProfileAnalyzeRequestBody {
  screenName: string;
}

interface ProfileFeedbackBody {
  screenName: string;
  markAsFalsePositive: boolean;
}

export function ProfileController(
  profileService: ProfileService,
  phishingStatService: PhishingStatService,
) {
  const router = express.Router();

  router.post(
    '/feedback',
    authenticated,
    defineBodyRoute<ProfileFeedbackBody>(async (req, res) => {
      try {
        const { screenName, markAsFalsePositive } = req.body;
        if (!screenName) {
          return res.status(400).json({ message: 'No profile sent.' });
        }

        const detectedProfile = await profileService.getProfileByScreenName(
          screenName,
        );
        if (!detectedProfile) {
          return res.status(404).json({ message: 'Profile not found.' });
        }

        if (markAsFalsePositive) {
          profileService.markProfileAsFalsePositive(detectedProfile);
        }

        res.status(200).json({});
      } catch (error: any) {
        res.status(400).send({ message: error.message });
      }
    }),
  );

  router.post(
    '/analyze',
    authenticated,
    defineBodyRoute<ProfileAnalyzeRequestBody>(async (req, res) => {
      try {
        const { screenName } = req.body;
        if (!screenName) {
          return res.status(400).json({ message: 'No profile sent.' });
        }

        const detectedProfile = await profileService.getProfileByScreenName(
          screenName,
        );
        if (detectedProfile) {
          profileService.addInteractionToAnalyzedProfile(detectedProfile);
          res.status(200).json({
            prediction: detectedProfile.markAsFalsePositive ? 0.0 : 1.0,
            predictionLabel: detectedProfile.markAsFalsePositive
              ? 'real'
              : 'fake',
            confidence: detectedProfile.confidenceLevel,
          });
          return;
        }

        const { predictionLabel, confidence, relatedCompany } =
          await profileService.runModel(screenName);

        if (predictionLabel === 'fake') {
          profileService.savePositiveCase(
            screenName,
            confidence.toString(),
            relatedCompany || '',
          );
          phishingStatService.incrementFakeProfiles(new Date());
          phishingStatService.incrementComplaintCreated(new Date());
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
