import { Controller, Get, Post, Req } from '@nestjs/common';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { TwitchApiService } from '@twitch/services/twitch-api';
import { Request } from 'express';

@Controller('webhooks/twitch')
export class SubscriptionWebhook {
  constructor(private readonly twitchApiService: TwitchApiService) {}

  @Get('health')
  health(): string {
    return 'Ok';
  }

  @Get('subscriptions')
  async getSubscriptions(): Promise<ITwitchSubscription[]> {
    return this.twitchApiService.getSubscriptions();
  }
}
