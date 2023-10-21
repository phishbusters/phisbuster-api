import { DigitalAsset, IDigitalAsset } from '../models/digital-assset';
import { User } from '../models/user';

export class DigitalAssetRepository {
  async save(asset: IDigitalAsset): Promise<IDigitalAsset> {
    return await new DigitalAsset(asset).save();
  }

  async saveMany(assets: IDigitalAsset[]): Promise<IDigitalAsset[]> {
    return await DigitalAsset.insertMany(assets);
  }

  async findByUserId(userId: string): Promise<IDigitalAsset[]> {
    const user = await User.findById(userId).populate('company.digitalAssets');
    if (!user || !user.company || !user.company.digitalAssets) {
      return [];
    }
    return user.company.digitalAssets;
  }
}
