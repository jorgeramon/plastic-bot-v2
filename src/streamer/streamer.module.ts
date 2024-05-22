import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { StreamerService } from '@streamer/services/streamer';
import { TwitchGateway } from '@streamer/gateways/twitch';
import { TwitchModule } from '@twitch/twitch.module';
import { NotificationService } from './services/notification';

@Module({
  imports: [DatabaseModule, TwitchModule],
  providers: [TwitchGateway, StreamerService, NotificationService],
})
export class StreamerModule {}
