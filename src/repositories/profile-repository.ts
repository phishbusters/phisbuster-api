import { AnalyzedProfile, IAnalyzedProfile } from '../models/analyzed-profiles';

export class ProfileRepository {
  async save(
    screenName: string,
    confidence: string,
    mostSimilarCompany?: string,
  ): Promise<IAnalyzedProfile> {
    const positiveCase = new AnalyzedProfile({
      profileId: screenName,
      confidenceLevel: confidence,
      relatedCompanyName: mostSimilarCompany,
    });

    return positiveCase.save();
  }
}
