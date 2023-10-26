import { AnalyzedProfile, IAnalyzedProfile } from '../models/analyzed-profiles';
import { Complaint, ComplaintStatus } from '../models/complaint';

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

    const complaint = await new Complaint({
      status: ComplaintStatus.Created,
      actionRequired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();

    const positiveCase = new AnalyzedProfile({
      profileId: screenName,
      confidenceLevel: confidence,
      relatedCompanyName: mostSimilarCompany,
      complaintId: complaint._id,
    });

    return positiveCase.save();
  }
}
