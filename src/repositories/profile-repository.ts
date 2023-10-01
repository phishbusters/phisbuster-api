import { AnalyzedProfile, IAnalyzedProfile } from '../models/analyzed-profiles';

export class ProfileRepository {
  async save(
    screenName: string,
    confidence: string,
    mostSimilarCompany?: string,
  ): Promise<IAnalyzedProfile> {
    const positiveCase = new AnalyzedProfile({
      screenName,
      confidence,
      mostSimilarCompany,
    });

    return positiveCase.save();
  }
}
