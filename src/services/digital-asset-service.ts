import { IDigitalAsset } from '../models/digital-assset';
import { DigitalAssetRepository } from '../repositories/digital-asset-repository';

export class DigitalAssetService {
  constructor(private digitalAssetRepository: DigitalAssetRepository) {}

  async saveAsset(asset: IDigitalAsset): Promise<IDigitalAsset> {
    return await this.digitalAssetRepository.save(asset);
  }

  async getAssetsByUserId(userId: string): Promise<IDigitalAsset[]> {
    return await this.digitalAssetRepository.findByUserId(userId);
  }
}
