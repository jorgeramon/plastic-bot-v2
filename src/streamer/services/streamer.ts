import { Platform } from "@database/enums/platform";
import { StreamerRepository } from "@database/repositories/streamer";
import { Injectable } from "@nestjs/common";
import { IStreamer } from "@streamer/interfaces/streamer";

@Injectable()
export class StreamerService {

  constructor(private readonly streamerRepository: StreamerRepository) {}

  async findTwitchAccount(discord: string) : Promise<IStreamer | null> {
    return this.streamerRepository.findOneByDiscordId(discord, Platform.TWITCH);
  }

  upsertTwitchAccount(discord: string, account: string): Promise<IStreamer> {
    return this.streamerRepository.upsert({ discord, account, platform: Platform.TWITCH });
  }
} 