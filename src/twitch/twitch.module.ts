import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwitchService } from '@twitch/services/twitch';
import { SubscriptionWebhook } from '@twitch/webhooks/subscription';
import { TwitchApiService } from '@twitch/services/twitch-api';
import { TwitchStreamRx } from '@twitch/rxjs/twitch-stream';

@Module({
  imports: [ConfigModule],
  controllers: [SubscriptionWebhook],
  providers: [TwitchService, TwitchApiService, TwitchStreamRx],
  exports: [TwitchService, TwitchStreamRx],
})
export class TwitchModule {}
