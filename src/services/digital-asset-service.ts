import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { s3 } from '../config/aws-config';
import { CreateDigitalAsset } from '../controllers/digital-asset-controller';
import {
  AssetType,
  DigitalAsset,
  IDigitalAsset,
} from '../models/digital-assset';
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

  async saveImage(
    file: Express.Multer.File,
    prefixFileName: string,
  ): Promise<IDigitalAsset | null> {
    const extension = path.extname(file.originalname);
    const uniqueFileName = `${prefixFileName}-${uuidv4()}${extension}`;
    const params = {
      Bucket: 'phish-buster-images',
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const s3Response = await s3.upload(params).promise();
      const asset = new DigitalAsset({
        assetType: AssetType.Image,
        assetContent: s3Response.Location,
      });
      return await this.digitalAssetRepository.save(asset);
    } catch (error) {
      console.log('uploading s3 error', error);
      return null;
    }
  }
}
