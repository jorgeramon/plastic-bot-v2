import { IChannelConfig } from '@admin/interfaces/channel-config';
import {
  ChannelConfig,
  ChannelConfigDocument,
} from '@admin/schemas/channel-config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChannelConfigService {
  constructor(
    @InjectModel(ChannelConfig.name) private model: Model<ChannelConfig>,
  ) {}

  async upsert(data: IChannelConfig): Promise<ChannelConfigDocument> {
    return this.model.findOneAndUpdate(
      { type: data.type },
      { channel: data.channel },
      { new: true, upsert: true },
    );
  }
}
