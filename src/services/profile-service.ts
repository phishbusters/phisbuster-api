import { envPrivateVars } from '../config/env-vars';
import { IAnalyzedProfile } from '../models/analyzed-profiles';
import { ProfileRepository } from '../repositories/profile-repository';

export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async runModel(
    screenName: string,
  ): Promise<{ prediction: string; confidence: number }> {
    try {
      const response = await fetch(envPrivateVars.chatFlaskService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenName }),
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar el modelo');
      }

      const data = await response.json();
      const { prediction, confidence } = data;
      return { prediction, confidence };
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
