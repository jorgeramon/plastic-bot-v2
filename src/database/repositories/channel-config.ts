import {
  ChannelConfig,
  ChannelConfigDocument,
} from '@database/schemas/channel-config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChannelConfigRepository {
  constructor(
    @InjectModel(ChannelConfig.name) private model: Model<ChannelConfig>,
  ) {}

  async upsert(data: ChannelConfig): Promise<ChannelConfigDocument> {
    return this.model.findOneAndUpdate(
      { type: data.type },
      { channel: data.channel },
      { new: true, upsert: true },
    );
  }
}
