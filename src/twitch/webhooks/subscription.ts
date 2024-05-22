import { Body, Controller, Get, Headers, Logger, Post } from '@nestjs/common';
import { Games } from '@twitch/enums/games';
import { ITwitchNotification } from '@twitch/interfaces/twitch-notification';
import { ITwitchStream } from '@twitch/interfaces/twitch-stream';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { IWebhookVerification } from '@twitch/interfaces/webhook-verification';
import { TwitchStreamRx } from '@twitch/rxjs/twitch-stream';
import { TwitchApiService } from '@twitch/services/twitch-api';

@Controller('webhooks/twitch')
export class SubscriptionWebhook {
  private readonly logger: Logger = new Logger(SubscriptionWebhook.name);

  constructor(
    private readonly twitchApiService: TwitchApiService,
    private readonly twitchStreamRx: TwitchStreamRx,
  ) {}

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
    @Body() data: IWebhookVerification | ITwitchNotification,
  ): Promise<string | void> {
    if (verification === 'webhook_callback_verification') {
      return (<IWebhookVerification>data).challenge;
    }

    const notification: ITwitchNotification = <ITwitchNotification>data;

    this.logger.debug(
      `Received notification from: ${notification.event.broadcaster_user_login}`,
    );

    const stream: ITwitchStream = await this.twitchApiService.getStreamByUser(
      notification.event.broadcaster_user_id,
    );

    if (!stream) {
      this.logger.warn(
        `No stream found for: ${notification.event.broadcaster_user_login}`,
      );
      return;
    }

    const isValidGame: boolean = Object.values(Games).some(
      (id: string) => id === stream.game_id,
    );

    if (!isValidGame) {
      this.logger.warn(
        `Streamer "${stream.user_login}" is playing "${stream.game_name}", which is not a valid game.`,
      );
      return;
    }

    stream.game = await this.twitchApiService.getGameById(stream.game_id);

    this.logger.debug(
      `Notification for "${stream.user_login}" sent over RX...`,
    );

    this.twitchStreamRx.nextNotification(stream);
  }
}
