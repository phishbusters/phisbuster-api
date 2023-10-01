import { AnalyzedProfile, IAnalyzedProfile } from '../models/analyzed-profiles';

export class ProfileRepository {
  async save(
    screenName: string,
    confidence: string,
    mostSimilarCompany?: string,
  ): Promise<IAnalyzedProfile> {
    const existingProfile = await AnalyzedProfile.findOne({
      profileId: screenName,
    });
    if (existingProfile) {
      return existingProfile;
    }

    const positiveCase = new AnalyzedProfile({
      profileId: screenName,
      confidenceLevel: confidence,
      relatedCompanyName: mostSimilarCompany,
    });

    return positiveCase.save();
  }
}
