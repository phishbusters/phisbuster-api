import { TakeDownController } from '../controllers/take-down-controller';
import { TakeDownRepository } from '../repositories/take-down-repository';
import { TakeDownService } from '../services/take-down-service';

const takeDownRepository = new TakeDownRepository();
const takeDownService = new TakeDownService(takeDownRepository);
const takeDownController = TakeDownController(takeDownService);

export { takeDownController as TakeDownRoutes };
