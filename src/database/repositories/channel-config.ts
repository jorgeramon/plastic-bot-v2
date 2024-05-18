import { IChannelConfig } from '@admin/interfaces/channel-config';
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

  async upsert(data: ChannelConfig): Promise<IChannelConfig> {
    const document: ChannelConfigDocument = await this.model.findOneAndUpdate(
      { type: data.type },
      { channel: data.channel },
      { new: true, upsert: true },
    );

    return document.toJSON();
  }

  async findOneByType(type: ChannelType): Promise<IChannelConfig | null> {
    const document: ChannelConfigDocument | null = await this.model
      .findOne({ type })
      .exec();
    return document !== null ? document.toJSON() : null;
  }
}
