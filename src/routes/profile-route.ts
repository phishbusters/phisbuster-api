import { ProfileController } from '../controllers/profile-controller';
import { ProfileRepository } from '../repositories/profile-repository';
import { ProfileService } from '../services/profile-service';
import { phishingStatService } from './phishing-stat-route';

const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = ProfileController(
  profileService,
  phishingStatService,
);

export { profileController as ProfileRoutes };
