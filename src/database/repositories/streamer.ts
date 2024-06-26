import { Platform } from '@database/enums/platform';
import { Streamer, StreamerDocument } from '@database/schemas/streamer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IStreamer } from '@streamer/interfaces/streamer';
import { Model } from 'mongoose';

@Injectable()
export class StreamerRepository {
  constructor(@InjectModel(Streamer.name) private model: Model<Streamer>) {}

  async findByAccount(account: string): Promise<IStreamer[]> {
    const documents: StreamerDocument[] = await this.model
      .find({ account })
      .exec();

    return documents.map((document) => document.toJSON());
  }

  async findOneByDiscordAndGuild(
    discord: string,
    guild: string,
    platform: Platform,
  ): Promise<IStreamer | null> {
    const document: StreamerDocument | null = await this.model.findOne({
      discord,
      guild,
      platform,
    });

    return document !== null ? document.toJSON() : null;
  }

  async findOneByAccountAndGuild(
    account: string,
    guild: string,
    platform: Platform,
  ): Promise<IStreamer | null> {
    const document: StreamerDocument | null = await this.model.findOne({
      account,
      guild,
      platform,
    });

    return document !== null ? document.toJSON() : null;
  }

  async upsert(data: Streamer): Promise<IStreamer> {
    const document: StreamerDocument = await this.model.findOneAndUpdate(
      { discord: data.discord },
      {
        account: data.account,
        platform: data.platform,
        guild: data.guild,
        metadata: data.metadata || null,
      },
      { new: true, upsert: true },
    );

    return document.toJSON();
  }

  async deleteById(_id: string): Promise<void> {
    await this.model.findByIdAndDelete(_id);
  }
}
