import { ChannelType } from '@database/enums/channel-type';
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

  upsert(data: ChannelConfig): Promise<ChannelConfigDocument> {
    return this.model.findOneAndUpdate(
      { type: data.type },
      { channel: data.channel },
      { new: true, upsert: true },
    );
  }

  findOneByType(type: ChannelType): Promise<ChannelConfigDocument | null> {
    return this.model.findOne({ type }).exec();
  }
}
