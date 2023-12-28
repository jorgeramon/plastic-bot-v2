import { FunaRepository } from '@database/repositories/funa';
import { Injectable } from '@nestjs/common';
import { sample } from 'lodash';

@Injectable()
export class FunaService {
  constructor(private readonly funaRepository: FunaRepository) {}

  async countReceivedFunas(userId: string): Promise<number> {
    const documents = await this.funaRepository.findByTo(userId);
    return documents.length;
  }

  async giveFuna(from: string, to: string): Promise<void> {
    await this.funaRepository.create({ from, to });
  }

  async getRandomFuned(): Promise<string> {
    const uniqueUsers = await this.funaRepository.getUniqueFunedUsers();
    return sample(uniqueUsers);
  }
}
