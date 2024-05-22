import { RuntimeException } from '@common/exceptions/runtime';
import { Injectable, Logger } from '@nestjs/common';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { ITwitchUser } from '@twitch/interfaces/twitch-user';
import { TwitchApiService } from '@twitch/services/twitch-api';

@Injectable()
export class TwitchService {
  private readonly logger: Logger = new Logger(TwitchService.name);

  constructor(private readonly twitchApiService: TwitchApiService) {}

  // TODO: Paginar hasta encontrar o descartar al usuario
  async getSubscriptionByUser(id: string): Promise<ITwitchSubscription | null> {
    const subscriptions = await this.twitchApiService.getSubscriptions();
    return (
      subscriptions.find(
        (subscription) =>
          subscription.condition.broadcaster_user_id.toString() ===
          id.toString(),
      ) || null
    );
  }

  async createSubscription(account: string): Promise<ITwitchSubscription> {
    const user: ITwitchUser = await this.twitchApiService.getUserByAccount(
      account,
    );

    if (!user) {
      throw new RuntimeException(
        'Usuario de Twitch no encontrado, ¿estás seguro de que lo escribiste bien?',
      );
    }

    let subscription = await this.getSubscriptionByUser(user.id);

    return subscription || this.twitchApiService.createSubscription(user.id);
  }

  async deleteSubscriptionByAccount(account: string): Promise<void> {
    this.logger.debug(`Deleting subscription by account: ${account}...`);

    const user = await this.twitchApiService.getUserByAccount(account);

    if (!user) {
      this.logger.warn(`No user found for account: ${account}`);
      return;
    }

    const subscription = await this.getSubscriptionByUser(user.id);

    if (subscription) {
      this.logger.warn(
        `No subscription found for account: ${account} - ${user.id}`,
      );
      return;
    }

    await this.twitchApiService.deleteSubscription(subscription.id);
  }

  async deleteSubscriptionById(id: string): Promise<void> {
    this.logger.debug(`Deleting subscription by id: ${id}...`);

    await this.twitchApiService.deleteSubscription(id);
  }
}
