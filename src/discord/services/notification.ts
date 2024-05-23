import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscordClient } from '@discord/services/discord-client';
import { StreamNotificationRx } from '@reactive/services/stream-notification';
import { IStreamNotification } from '@reactive/interfaces/stream-notification';
import { StreamerRepository } from '@database/repositories/streamer';
import { IStreamer } from '@streamer/interfaces/streamer';
import { combineLatest, from, of, switchMap } from 'rxjs';
import {
  EmbedBuilder,
  Guild,
  MessageCreateOptions,
  TextChannel,
  User,
} from 'discord.js';
import { ChannelConfigRepository } from '@database/repositories/channel-config';
import { IChannelConfig } from '@admin/interfaces/channel-config';
import { ChannelType } from '@database/enums/channel-type';

@Injectable()
export class NotificationService implements OnApplicationBootstrap {
  constructor(
    private readonly discordClient: DiscordClient,
    private readonly streamNotification: StreamNotificationRx,
    private readonly streamerRepository: StreamerRepository,
    private readonly channelConfigRepository: ChannelConfigRepository,
  ) {}

  onApplicationBootstrap() {
    this.onNotification();
  }

  onNotification(): void {
    this.streamNotification
      .onNotification()
      .pipe(
        switchMap((stream: IStreamNotification) =>
          combineLatest([
            of(stream),
            from(this.streamerRepository.findByAccount(stream.account)),
          ]),
        ),
        switchMap(([stream, accounts]: [IStreamNotification, IStreamer[]]) =>
          from(this.sendMessage(stream, accounts)),
        ),
      )
      .subscribe();
  }

  async sendMessage(
    stream: IStreamNotification,
    accounts: IStreamer[],
  ): Promise<void> {
    for (let account of accounts) {
      const user: User = await this.discordClient.users.fetch(account.discord);
      const guild: Guild = await this.discordClient.guilds.fetch(account.guild);
      const channelConfig: IChannelConfig =
        await this.channelConfigRepository.findOneByTypeAndGuild(
          ChannelType.STREAM,
          guild.id,
        );
      const channel = await this.discordClient.channels.fetch(
        channelConfig.channel,
      );

      await (channel as TextChannel).send(this.buildMessage(user, stream.game));
    }
  }

  private buildMessage(user: User, game: string): MessageCreateOptions {
    return {
      embeds: [
        EmbedBuilder.from({
          title: `¡${user.username} ha comenzado directo!`,
        }),
      ],
    };
  }
}
