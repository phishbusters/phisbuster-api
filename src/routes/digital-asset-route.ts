import { DigitalAssetController } from '../controllers/digital-asset-controller';
import { DigitalAssetRepository } from '../repositories/digital-asset-repository';
import { DigitalAssetService } from '../services/digital-asset-service';
import { userService } from './user-route';

const digitalAssetRepository = new DigitalAssetRepository();
const digitalAssetService = new DigitalAssetService(digitalAssetRepository);
const digitalAssetController = DigitalAssetController(
  digitalAssetService,
  userService,
);

export { digitalAssetController as DigitalAssetRoutes };
