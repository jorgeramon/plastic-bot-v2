import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { StreamerService } from '@streamer/services/streamer';
import { TwitchGateway } from '@streamer/gateways/twitch';

@Module({
  imports: [DatabaseModule],
  providers: [TwitchGateway, StreamerService],
})
export class StreamerModule {}
