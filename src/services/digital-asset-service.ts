import { CreateDigitalAsset } from '../controllers/digital-asset-controller';
import { DigitalAsset, IDigitalAsset } from '../models/digital-assset';
import { DigitalAssetRepository } from '../repositories/digital-asset-repository';

export class DigitalAssetService {
  constructor(private digitalAssetRepository: DigitalAssetRepository) {}

  async saveAsset(asset: IDigitalAsset): Promise<IDigitalAsset> {
    return await this.digitalAssetRepository.save(asset);
  }

  async saveAssets(assets: CreateDigitalAsset[]): Promise<IDigitalAsset[]> {
    const digitalAsset: IDigitalAsset[] = [];

    assets.forEach((asset) => {
      digitalAsset.push(
        new DigitalAsset({
          assetType: asset.assetType,
          assetContent: asset.value,
        }),
      );
    });

    return await this.digitalAssetRepository.saveMany(digitalAsset);
  }

  async getAssetsByUserId(userId: string): Promise<IDigitalAsset[]> {
    return await this.digitalAssetRepository.findByUserId(userId);
  }
}
