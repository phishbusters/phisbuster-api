import { IPhishingStat, PhishingStat } from '../models/phishing-stat';

export class PhishingStatRepository {
  async create(stat: IPhishingStat): Promise<IPhishingStat> {
    return PhishingStat.create(stat);
  }

  async createOrUpdateStat(
    date: Date,
    fieldToUpdate: keyof IPhishingStat,
  ): Promise<void> {
    const stat = await this.getStatByDate(date);
    if (stat) {
      stat[fieldToUpdate]++;
      await stat.save();
    } else {
      await PhishingStat.create({ date, [fieldToUpdate]: 1 });
    }
  }

  async getStatsForLastWeek(): Promise<IPhishingStat[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return PhishingStat.find({ date: { $gte: oneWeekAgo } });
  }

  async getStatByDate(date: Date): Promise<IPhishingStat | null> {
    return PhishingStat.findOne({ date });
  }
}
