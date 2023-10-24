import { ChannelType } from '@admin/enums/channel-type';
import { ChannelConfigRepository } from '@database/repositories/channel-config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminChannelService {
  constructor(
    private readonly channelConfigRepository: ChannelConfigRepository,
  ) {}

  async setConfessionChannel(channelId: string): Promise<void> {
    await this.channelConfigRepository.upsert({
      type: ChannelType.CONFESSION,
      channel: channelId,
    });
  }
}
