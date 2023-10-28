import { get } from 'http';
import { TakeDownRepository } from '../repositories/take-down-repository';

export class TakeDownService {
  constructor(private takeDownRepository: TakeDownRepository) {}

  async getComplaintsWithCompanyOrSimilarName(companyName: string) {
    return this.takeDownRepository.getComplaintsWithCompanyOrSimilarName(
      companyName,
    );
  }
}
