import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DiscordClient } from '@discord/services/discord-client';
import { StreamNotificationRx } from '@reactive/services/stream-notification';
import { IStreamNotification } from '@reactive/interfaces/stream-notification';
import { StreamerRepository } from '@database/repositories/streamer';
import { IStreamer } from '@streamer/interfaces/streamer';
import { combineLatest, from, of, switchMap, tap } from 'rxjs';
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
import { Platform } from '@database/enums/platform';
import { IStreamPlatform } from '@discord/interfaces/stream-platform';

@Injectable()
export class NotificationService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(NotificationService.name);

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
        tap((stream: IStreamNotification) =>
          this.logger.debug(
            `Processing notfication: ${stream.account} - ${stream.game} - ${stream.platform}`,
          ),
        ),
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
    this.logger.debug(`Processing ${accounts.length} accounts...`);

    for (let account of accounts) {
      this.logger.debug('Fetching discord user...');
      const user: User = await this.discordClient.users.fetch(account.discord);
      this.logger.debug(`User: ${user.id} - ${user.username}`);

      this.logger.debug('Fetching discord guild...');
      const guild: Guild = await this.discordClient.guilds.fetch(account.guild);
      this.logger.debug(`Guild: ${guild.id} - ${guild.name}`);

      const channelConfig: IChannelConfig =
        await this.channelConfigRepository.findOneByTypeAndGuild(
          ChannelType.STREAM,
          guild.id,
        );

      this.logger.debug('Fetching discord channel...');
      const channel = await this.discordClient.channels.fetch(
        channelConfig.channel,
      );
      this.logger.debug(`Channel: ${channel.id}`);

      this.logger.debug(
        `Sending message about stream "${user.username}" on "${
          guild.name
        }" to "${(<TextChannel>channel).name}"`,
      );

      await (channel as TextChannel).send(this.buildMessage(user, stream));
    }
  }

  private buildMessage(
    user: User,
    stream: IStreamNotification,
  ): MessageCreateOptions {
    const platform = this.getPlatform(stream.platform);

    const builder = new EmbedBuilder()
      .setTitle(
        `¡${user.displayName} ha comenzado directo en ${platform.name}!`,
      )
      .setDescription(
        `<@${user.id}> está transmitiendo **${stream.game}**. Ven y disfruta de su contenido :D`,
      )
      .setThumbnail(user.avatarURL())
      .setFooter({
        iconURL: platform.logo,
        text: platform.name,
      })
      .setURL(stream.link);

    if (stream.preview) {
      builder.setImage(stream.preview);
    }

    return {
      embeds: [builder],
    };
  }

  private getPlatform(platform: Platform): IStreamPlatform {
    switch (platform) {
      case Platform.TWITCH:
        return {
          name: 'Twitch',
          logo: 'https://img.freepik.com/premium-vector/twitch-logo_578229-259.jpg',
        };
    }
  }
}
