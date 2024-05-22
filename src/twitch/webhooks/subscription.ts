import { Body, Controller, Get, Headers, Logger, Post } from '@nestjs/common';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { IWebhookVerification } from '@twitch/interfaces/webhook-verification';
import { TwitchApiService } from '@twitch/services/twitch-api';

@Controller('webhooks/twitch')
export class SubscriptionWebhook {
  private readonly logger: Logger = new Logger(SubscriptionWebhook.name);

  constructor(private readonly twitchApiService: TwitchApiService) {}

  @Get('health')
  health(): string {
    return 'Ok';
  }

  @Get('subscriptions')
  async getSubscriptions(): Promise<ITwitchSubscription[]> {
    return this.twitchApiService.getSubscriptions();
  }

  @Post()
  async handleSubscription(
    @Headers('Twitch-Eventsub-Message-Type') verification: string,
    @Body() data: IWebhookVerification | ITwitchSubscription,
  ): Promise<string | void> {
    if (verification === 'webhook_callback_verification') {
      return (<IWebhookVerification>data).challenge;
    }

    const subscription: ITwitchSubscription = <ITwitchSubscription>data;

    this.logger.debug(`Streamer is online!`);
    this.logger.debug(subscription);
  }
}
