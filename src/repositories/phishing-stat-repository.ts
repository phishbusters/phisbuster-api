import { IPhishingStat, PhishingStat } from '../models/phishing-stat';

export class PhishingStatRepository {
  async create(
    stat: IPhishingStat,
    field: keyof IPhishingStat,
  ): Promise<IPhishingStat> {
    return this.createOrUpdateStat(stat.date, field);
  }

  async createOrUpdateStat(
    date: Date,
    fieldToUpdate: keyof IPhishingStat,
  ): Promise<IPhishingStat> {
    const stat = await this.getStatByDate(date);
    if (stat) {
      stat[fieldToUpdate]++;
      return await stat.save();
    } else {
      return await PhishingStat.create({ date, [fieldToUpdate]: 1 });
    }
  }

  async getStatsForLastWeek(): Promise<IPhishingStat[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    return PhishingStat.find({ date: { $gte: oneWeekAgo } });
  }

  async getStatByDate(date: Date): Promise<IPhishingStat | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return PhishingStat.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  }
}
