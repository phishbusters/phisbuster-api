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
    relatedCompany: string;
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

      const {
        prediction,
        prediction_label,
        confidence,
        prediction_time,
        related_company,
      } = await response.json();
      return {
        prediction,
        predictionLabel: prediction_label,
        confidence,
        predictionTime: prediction_time,
        relatedCompany: related_company,
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
    const newProfile = await this.profileRepository.save(
      screenName,
      confidence,
      mostSimilarCompany,
    );

    this.addInteractionToAnalyzedProfile(newProfile);
    return newProfile;
  }

  async getProfileByScreenName(
    screenName: string,
  ): Promise<IAnalyzedProfile | null> {
    return this.profileRepository.getByScreenName(screenName);
  }

  async addInteractionToAnalyzedProfile(
    analyzedProfile: IAnalyzedProfile,
  ): Promise<void> {
    await this.profileRepository.addInteractionToAnalyzedProfile(
      analyzedProfile,
    );
  }

  async markProfileAsFalsePositive(
    analyzedProfile: IAnalyzedProfile,
  ): Promise<void> {
    await this.profileRepository.markProfileAsFalsePositive(analyzedProfile);
  }
}
