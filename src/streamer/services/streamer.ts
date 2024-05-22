import { RuntimeException } from '@common/exceptions/runtime';
import { Platform } from '@database/enums/platform';
import { StreamerRepository } from '@database/repositories/streamer';
import { Injectable } from '@nestjs/common';
import { IStreamer } from '@streamer/interfaces/streamer';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { ITwitchUser } from '@twitch/interfaces/twitch-user';
import { TwitchService } from '@twitch/services/twitch';

@Injectable()
export class StreamerService {
  constructor(
    private readonly streamerRepository: StreamerRepository,
    private readonly twitchService: TwitchService,
  ) {}

  findTwitchAccount(discord: string): Promise<IStreamer | null> {
    return this.streamerRepository.findOneByDiscordId(discord, Platform.TWITCH);
  }

  findTwitchAccountByName(account: string): Promise<IStreamer | null> {
    return this.streamerRepository.findOneByAccount(account, Platform.TWITCH);
  }

  upsertTwitchAccount(
    discord: string,
    account: string,
    subscription: ITwitchSubscription,
  ): Promise<IStreamer> {
    return this.streamerRepository.upsert({
      discord,
      account,
      platform: Platform.TWITCH,
      metadata: subscription,
    });
  }

  async deleteAccount(_id: string): Promise<void> {
    await this.streamerRepository.deleteById(_id);
  }

  async createTwitchSubscription(
    discord: string,
    account: string,
  ): Promise<IStreamer> {
    const subscription: ITwitchSubscription =
      await this.twitchService.createSubscription(account);

    return this.upsertTwitchAccount(discord, account, subscription);
  }
}
