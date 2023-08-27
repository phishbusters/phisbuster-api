import { PhishingStatController } from '../controllers/phishing-stat-controller';
import { PhishingStatRepository } from '../repositories/phishing-stat-repository';
import { PhishingStatService } from '../services/phishing-stat-service';

const phishingStatRepository = new PhishingStatRepository();
const phishingStatService = new PhishingStatService(phishingStatRepository);
const phishingStatController = PhishingStatController(phishingStatService);

export { phishingStatController as PhishingStatRoute, phishingStatService };
