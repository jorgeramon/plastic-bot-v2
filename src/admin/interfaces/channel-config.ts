import { ChannelType } from '@admin/enums/channel-type';

export interface IChannelConfig {
  type: ChannelType;
  channel: string;
}
