import { ChannelType } from '@database/enums/channel-type';
import { ChannelConfigRepository } from '@database/repositories/channel-config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfessionService {
  constructor(
    private readonly channelConfigRepository: ChannelConfigRepository,
  ) {}

  async getChannel(guild: string): Promise<string | null> {
    const config = await this.channelConfigRepository.findOneByTypeAndGuild(
      ChannelType.CONFESSION,
      guild,
    );
    return config?.channel;
  }
}
