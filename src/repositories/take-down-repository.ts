import { Complaint, ComplaintStatus, IComplaint } from '../models/complaint';
import { AnalyzedProfile } from '../models/analyzed-profiles';

export class TakeDownRepository {
  async getComplaintsWithCompanyOrSimilarName(
    companyName: string,
  ): Promise<{ id: string; status: ComplaintStatus; profileId: string }[]> {
    const matchingProfiles = await AnalyzedProfile.find({
      relatedCompanyName: companyName,
    }).select('complaintId profileId');
    const complaintIds = matchingProfiles.map((profile) => profile.complaintId);
    const complaints = await Complaint.find({
      _id: { $in: complaintIds },
    }).select('id status createdAt updatedAt');

    const result = complaints.map((complaint) => {
      const correspondingProfile = matchingProfiles.find(
        (profile) =>
          profile.complaintId?.toString() === complaint._id.toString(),
      );

      return {
        id: complaint._id.toString(),
        status: complaint.status,
        profileId: correspondingProfile?.profileId || 'Unknown',
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      };
    });

    return result;
  }
}
