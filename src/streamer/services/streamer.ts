import { Platform } from '@database/enums/platform';
import { StreamerRepository } from '@database/repositories/streamer';
import { Injectable } from '@nestjs/common';
import { IStreamer } from '@streamer/interfaces/streamer';

@Injectable()
export class StreamerService {
  constructor(private readonly streamerRepository: StreamerRepository) {}

  findTwitchAccount(discord: string): Promise<IStreamer | null> {
    return this.streamerRepository.findOneByDiscordId(discord, Platform.TWITCH);
  }

  findTwitchAccountByName(account: string): Promise<IStreamer | null> {
    return this.streamerRepository.findOneByAccount(account, Platform.TWITCH);
  }

  upsertTwitchAccount(discord: string, account: string): Promise<IStreamer> {
    return this.streamerRepository.upsert({
      discord,
      account,
      platform: Platform.TWITCH,
    });
  }

  async deleteAccount(_id: string): Promise<void> {
    await this.streamerRepository.deleteById(_id);
  }
}
