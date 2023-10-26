import {
  AnalyzedProfile,
  DetectedBy,
  IAnalyzedProfile,
} from '../models/analyzed-profiles';
import { Complaint, ComplaintStatus } from '../models/complaint';

export class ProfileRepository {
  async save(
    screenName: string,
    confidence: string,
    mostSimilarCompany?: string,
    detectedBy = DetectedBy.user,
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
      detectedBy,
    });

    return positiveCase.save();
  }

  async getByScreenName(screenName: string): Promise<IAnalyzedProfile | null> {
    return AnalyzedProfile.findOne({ profileId: screenName });
  }

  async addInteractionToAnalyzedProfile(
    profile: IAnalyzedProfile,
  ): Promise<void> {
    const profileId = profile._id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const updated = await AnalyzedProfile.findOneAndUpdate(
      {
        _id: profileId,
        'userInteractions.date': {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      {
        $inc: { 'userInteractions.$.interactions': 1 },
      },
    );

    if (!updated) {
      await AnalyzedProfile.updateOne(
        { _id: profileId },
        {
          $push: {
            userInteractions: {
              interactions: 1,
              date: startOfDay,
            },
          },
        },
      );
    }
  }

  async markProfileAsFalsePositive(profile: IAnalyzedProfile): Promise<void> {
    await AnalyzedProfile.updateOne(
      { _id: profile._id },
      {
        markAsFalsePositive: true,
      },
    );
  }
}
