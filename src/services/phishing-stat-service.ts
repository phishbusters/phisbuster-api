import { IPhishingStat } from '../models/phishing-stat';
import { PhishingStatRepository } from '../repositories/phishing-stat-repository';

export class PhishingStatService {
  constructor(private phishingStatRepository: PhishingStatRepository) {}

  // async recordStat(stat: IPhishingStat): Promise<IPhishingStat> {
  //   return this.phishingStatRepository.create(stat);
  // }

  async getStatsForLastWeek(): Promise<IPhishingStat[]> {
    return this.phishingStatRepository.getStatsForLastWeek();
  }

  async sinceCreation(): Promise<{
    totalPhishingChats: number;
    totalFakeProfiles: number;
    totalComplaintsClosed: number;
    totalComplaintsCreated: number;
    totalComplaintsInProgress: number;
  }> {
    return this.phishingStatRepository.sinceCreation();
  }

  async incrementPhishingChats(date: Date): Promise<void> {
    await this.phishingStatRepository.createOrUpdateStat(
      date,
      'phishingChatsDetected',
    );
  }

  async incrementFakeProfiles(date: Date): Promise<void> {
    await this.phishingStatRepository.createOrUpdateStat(
      date,
      'fakeProfilesDetected',
    );
  }

  async incrementComplaintCreated(date: Date): Promise<void> {
    await this.phishingStatRepository.createOrUpdateStat(
      date,
      'complaintsCreated',
    );
  }

  async getAmountDetectedByActor(): Promise<{
    detectedBySystem: number;
    detectedByUser: number;
  }> {
    return await this.phishingStatRepository.getAmountDetectedByActor();
  }

  async getFalsePositiveAndInteractions(): Promise<{
    falsePositiveCount: number;
    positivesCount: number;
    interactionRateForFalsePositive: number;
    interactionRateForPositives: number;
    interactionRates: { date: Date; interactionRate: number }[];
  }> {
    return await this.phishingStatRepository.getFalsePositiveAndInteractions();
  }
}
