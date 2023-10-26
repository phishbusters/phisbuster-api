import { AnalyzedProfile } from '../models/analyzed-profiles';
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

  async sinceCreation(): Promise<{
    totalPhishingChats: number;
    totalFakeProfiles: number;
    totalComplaintsClosed: number;
    totalComplaintsCreated: number;
    totalComplaintsInProgress: number;
  }> {
    const result = await PhishingStat.aggregate([
      {
        $group: {
          _id: null,
          totalPhishingChats: { $sum: '$phishingChatsDetected' },
          totalFakeProfiles: { $sum: '$fakeProfilesDetected' },
          totalComplaintsClosed: { $sum: '$complaintsClosed' },
          totalComplaintsCreated: { $sum: '$complaintsCreated' },
          totalComplaintsInProgress: { $sum: '$complaintsInProgress' },
        },
      },
    ]);

    if (result.length > 0) {
      return {
        totalPhishingChats: result[0].totalPhishingChats,
        totalFakeProfiles: result[0].totalFakeProfiles,
        totalComplaintsClosed: result[0].totalComplaintsClosed,
        totalComplaintsCreated: result[0].totalComplaintsCreated,
        totalComplaintsInProgress: result[0].totalComplaintsInProgress,
      };
    } else {
      return {
        totalPhishingChats: 0,
        totalFakeProfiles: 0,
        totalComplaintsClosed: 0,
        totalComplaintsCreated: 0,
        totalComplaintsInProgress: 0,
      };
    }
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

  async getAmountDetectedByActor(): Promise<{
    detectedBySystem: number;
    detectedByUser: number;
  }> {
    const counts = await AnalyzedProfile.aggregate([
      {
        $group: {
          _id: '$detectedBy',
          count: { $sum: 1 },
        },
      },
    ]);

    const detectedBySystem = counts.find((c) => c._id === 'system') || {
      count: 0,
    };
    const detectedByUser = counts.find((c) => c._id === 'user') || { count: 0 };

    return {
      detectedBySystem: detectedBySystem.count,
      detectedByUser: detectedByUser.count,
    };
  }

  async getFalsePositiveAndInteractions(): Promise<{
    falsePositiveCount: number;
    positivesCount: number;
    interactionRateForFalsePositive: number;
    interactionRateForPositives: number;
    interactionRates: { date: Date; interactionRate: number }[];
  }> {
    const counts = await AnalyzedProfile.aggregate([
      {
        $unwind: '$userInteractions',
      },
      {
        $group: {
          _id: '$markAsFalsePositive',
          count: { $sum: 1 },
          totalInteractions: { $sum: '$userInteractions.interactions' },
        },
      },
    ]);

    const falsePositive = counts.find((c) => c._id === true) || {
      count: 0,
      totalInteractions: 0,
    };
    const positives = counts.find((c) => c._id === false) || {
      count: 0,
      totalInteractions: 0,
    };

    const interactionRateForFalsePositive =
      falsePositive.count === 0
        ? 0
        : falsePositive.totalInteractions / falsePositive.count;
    const interactionRateForPositives =
      positives.count === 0 ? 0 : positives.totalInteractions / positives.count;

    const interactionRatesByTime = await AnalyzedProfile.aggregate([
      {
        $unwind: '$userInteractions',
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$userInteractions.date',
              },
            },
            markAsFalsePositive: '$markAsFalsePositive',
          },
          totalInteractions: { $sum: '$userInteractions.interactions' },
          totalCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    const interactionRates = interactionRatesByTime.reduce((acc, record) => {
      const date = record._id.date;
      const isFalsePositive = record._id.markAsFalsePositive;
      const interactionRate =
        record.totalCount === 0
          ? 0
          : record.totalInteractions / record.totalCount;

      if (!acc[date]) {
        acc[date] = {
          date,
          interactionRateForFalsePositive: 0,
          interactionRateForPositives: 0,
          interactionRateGeneral: 0,
        };
      }

      if (isFalsePositive) {
        acc[date].interactionRateForFalsePositive = interactionRate;
      } else {
        acc[date].interactionRateForPositives = interactionRate;
      }

      acc[date].interactionRateGeneral += interactionRate;

      return acc;
    }, {});

    return {
      falsePositiveCount: falsePositive.count,
      positivesCount: positives.count,
      interactionRateForFalsePositive,
      interactionRateForPositives,
      interactionRates: Object.values(interactionRates),
    };
  }
}
