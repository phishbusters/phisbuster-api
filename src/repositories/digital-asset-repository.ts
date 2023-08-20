import { DigitalAsset, IDigitalAsset } from '../models/digital-assset';

export class DigitalAssetRepository {
  async save(asset: IDigitalAsset): Promise<IDigitalAsset> {
    return await new DigitalAsset(asset).save();
  }

  async findByUserId(userId: string): Promise<IDigitalAsset[]> {
    return await DigitalAsset.find({ userId });
  }
}
