import { ChannelType } from '@database/enums/channel-type';

export interface IChannelConfig {
  type: ChannelType;
  channel: string;
  guild: string;
}
