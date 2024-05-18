import { Platform } from '@database/enums/platform';
import { Streamer, StreamerDocument } from '@database/schemas/streamer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IStreamer } from '@streamer/interfaces/streamer';
import { Model } from 'mongoose';

@Injectable()
export class StreamerRepository {
  constructor(@InjectModel(Streamer.name) private model: Model<Streamer>) {}

  async findOneByDiscordId(
    discord: string,
    platform: Platform,
  ): Promise<IStreamer | null> {
    const document: StreamerDocument | null = await this.model.findOne({
      discord,
      platform,
    });
    return document !== null ? document.toJSON() : null;
  }

  async findOneByAccount(
    account: string,
    platform: Platform,
  ): Promise<IStreamer | null> {
    const document: StreamerDocument | null = await this.model.findOne({
      account,
      platform,
    });
    return document !== null ? document.toJSON() : null;
  }

  async upsert(data: Streamer): Promise<IStreamer> {
    const document: StreamerDocument = await this.model.findOneAndUpdate(
      { discord: data.discord },
      { account: data.account, platform: data.platform },
      { new: true, upsert: true },
    );

    return document.toJSON();
  }

  async deleteById(_id: string): Promise<void> {
    await this.model.findByIdAndDelete(_id);
  }
}
