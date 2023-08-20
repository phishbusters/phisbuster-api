import express from 'express';
import authenticated from '../middleware/authenticated';
import { DigitalAssetService } from '../services/digital-asset-service';

export function DigitalAssetController(
  digitalAssetService: DigitalAssetService,
) {
  const router = express.Router();

  router.post('/upload', authenticated, async (req, res) => {
    const user = req.user;
    if (!user.isCompany()) {
      return res.status(403).json({
        error: 'Access forbidden.',
      });
    }

    const asset = await digitalAssetService.saveAsset(req.body);
    res.status(201).json(asset);
  });

  router.get('/assets', authenticated, async (req, res) => {
    const user = req.user;
    if (!user.isCompany()) {
      return res.status(403).json({ error: 'Access forbidden.' });
    }

    const assets = await digitalAssetService.getAssetsByUserId(req.user._id);
    res.status(200).json(assets);
  });
}
