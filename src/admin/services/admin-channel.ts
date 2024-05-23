import { ChannelType } from '@database/enums/channel-type';
import { ChannelConfigRepository } from '@database/repositories/channel-config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminChannelService {
  constructor(
    private readonly channelConfigRepository: ChannelConfigRepository,
  ) {}

  async setChannel(
    channelId: string,
    type: ChannelType,
    guild: string,
  ): Promise<void> {
    await this.channelConfigRepository.upsert({
      type,
      channel: channelId,
      guild,
    });
  }
}
