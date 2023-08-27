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
}
