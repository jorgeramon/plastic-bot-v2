import { RuntimeException } from '@common/exceptions/runtime';
import { Platform } from '@database/enums/platform';
import { StreamerRepository } from '@database/repositories/streamer';
import { Injectable } from '@nestjs/common';
import { IStreamer } from '@streamer/interfaces/streamer';
import { ITwitchStreamer } from '@streamer/interfaces/twitch-streamer';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { ITwitchUser } from '@twitch/interfaces/twitch-user';
import { TwitchService } from '@twitch/services/twitch';

@Injectable()
export class StreamerService {
  constructor(
    private readonly streamerRepository: StreamerRepository,
    private readonly twitchService: TwitchService,
  ) {}

  async getTwitchAccountByDiscordAndGuild(
    discord: string,
    guild: string,
  ): Promise<ITwitchStreamer | null> {
    const streamer: IStreamer | null =
      await this.streamerRepository.findOneByDiscordAndGuild(
        discord,
        guild,
        Platform.TWITCH,
      );

    if (!streamer) {
      return null;
    }

    const user: ITwitchUser | null = await this.twitchService.getUserById(
      streamer.account,
    );

    if (!user) {
      return null;
    }

    return {
      ...streamer,
      login: user.login,
      profile: user.profile_image_url,
    };
  }

  async getTwitchAccountByLoginAndGuild(
    login: string,
    guild: string,
  ): Promise<ITwitchStreamer | null> {
    const user: ITwitchUser | null = await this.twitchService.getUserByLogin(
      login,
    );

    if (!user) {
      return null;
    }

    const streamer: IStreamer | null =
      await this.streamerRepository.findOneByAccountAndGuild(
        user.id,
        guild,
        Platform.TWITCH,
      );

    if (!streamer) {
      return null;
    }

    return {
      ...streamer,
      login: user.login,
      profile: user.profile_image_url,
    };
  }

  async createTwitchSubscription(
    discord: string,
    login: string,
    guild: string,
  ): Promise<IStreamer> {
    const subscription: ITwitchSubscription =
      await this.twitchService.createSubscription(login);

    return this.upsertTwitchStreamer(
      discord,
      subscription.condition.broadcaster_user_id,
      guild,
      subscription,
    );
  }

  async deleteTwitchSubscription(streamer: IStreamer) {
    if (streamer.metadata) {
      await this.twitchService.deleteSubscriptionById(streamer.metadata.id);
    } else {
      await this.twitchService.deleteSubscriptionByAccount(streamer.account);
    }

    await this.deleteStreamerById(streamer._id);
  }

  findStreamerByDiscordAndGuild(
    account: string,
    guild: string,
  ): Promise<IStreamer | null> {
    return this.streamerRepository.findOneByDiscordAndGuild(
      account,
      guild,
      Platform.TWITCH,
    );
  }

  upsertTwitchStreamer(
    discord: string,
    account: string,
    guild: string,
    subscription: ITwitchSubscription,
  ): Promise<IStreamer> {
    return this.streamerRepository.upsert({
      discord,
      account,
      guild,
      platform: Platform.TWITCH,
      metadata: subscription,
    });
  }

  async deleteStreamerById(_id: string): Promise<void> {
    await this.streamerRepository.deleteById(_id);
  }
}
