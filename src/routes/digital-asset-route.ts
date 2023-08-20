import { DigitalAssetController } from '../controllers/digital-asset-controller';
import { DigitalAssetRepository } from '../repositories/digital-asset-repository';
import { DigitalAssetService } from '../services/digital-asset-service';

const digitalAssetRepository = new DigitalAssetRepository();
const digitalAssetService = new DigitalAssetService(digitalAssetRepository);
const digitalAssetController = DigitalAssetController(digitalAssetService);

export { digitalAssetController as DigitalAssetRoutes };
