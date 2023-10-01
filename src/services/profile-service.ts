import { envPrivateVars } from '../config/env-vars';
import { IAnalyzedProfile } from '../models/analyzed-profiles';
import { ProfileRepository } from '../repositories/profile-repository';

export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async runModel(screenName: string): Promise<{
    prediction: number[];
    predictionLabel: 'fake' | 'real';
    confidence: number;
    predictionTime: Date;
  }> {
    try {
      const response = await fetch(envPrivateVars.profileFlaskService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screen_name: screenName }),
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar el modelo');
      }

      const { prediction, prediction_label, confidence, prediction_time } =
        await response.json();
      return {
        prediction,
        predictionLabel: prediction_label,
        confidence,
        predictionTime: prediction_time,
      };
    } catch (error) {
      console.error('Error al ejecutar el modelo:', error);
      throw new Error('Error al ejecutar el modelo');
    }
  }

  async savePositiveCase(
    screenName: string,
    confidence: string,
    mostSimilarCompany?: string,
  ): Promise<IAnalyzedProfile> {
    return this.profileRepository.save(
      screenName,
      confidence,
      mostSimilarCompany,
    );
  }
}
