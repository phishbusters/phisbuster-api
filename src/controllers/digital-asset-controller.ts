import express from 'express';
import { multerUploadConfig } from '../config/multer';
import { defineBodyRoute } from '../helpers/define-route';
import authenticated from '../middleware/authenticated';
import { AssetType } from '../models/digital-assset';
import { DigitalAssetService } from '../services/digital-asset-service';
import { UserService } from '../services/user-service';

export interface CreateDigitalAsset {
  assetType: AssetType;
  value: string;
}

export function DigitalAssetController(
  digitalAssetService: DigitalAssetService,
  userService: UserService,
) {
  const router = express.Router();

  router.post(
    '/',
    authenticated,
    defineBodyRoute<{ newAssets: CreateDigitalAsset[] }>(async (req, res) => {
      const user = req.user;
      // if (!user.isCompany()) {
      //   return res.status(403).json({
      //     message: 'Forbidden.',
      //   });
      // }

      const { newAssets } = req.body;
      const assets = await digitalAssetService.saveAssets(newAssets);
      const updatedUser = await userService.updateUserAssets(user, assets);
      res.status(201).json({ assets, updatedUser });
    }),
  );

  router.get('/assets', authenticated, async (req, res) => {
    const user = req.user;
    // if (!user.isCompany()) {
    //   return res.status(403).json({ message: 'Access forbidden.' });
    // }

    const assets = await digitalAssetService.getAssetsByUserId(req.user._id);
    res.status(200).json(assets);
  });

  router.post(
    '/images',
    authenticated,
    multerUploadConfig.single('file'),
    async (req, res) => {
      const file = req.file;
      const user = req.user;
      const userFileName = user.username.split('@')[0];
      if (!file) {
        return res
          .status(400)
          .json({ message: 'La imagen cargada es incorrecta.' });
      }

      const assetSaved = await digitalAssetService.saveImage(
        file,
        userFileName,
      );
      if (assetSaved) {
        res.status(201).json(assetSaved);
      } else {
        res.status(500).json({ message: 'Error al guardar la imagen.' });
      }
    },
  );

  return router;
}
