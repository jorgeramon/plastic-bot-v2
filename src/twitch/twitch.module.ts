import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwitchService } from '@twitch/services/twitch';
import { SubscriptionWebhook } from '@twitch/webhooks/subscription';
import { TwitchApiService } from '@twitch/services/twitch-api';

@Module({
  imports: [ConfigModule],
  controllers: [SubscriptionWebhook],
  providers: [TwitchService, TwitchApiService],
  exports: [TwitchService],
})
export class TwitchModule {}
