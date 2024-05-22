import { RuntimeException } from '@common/exceptions/runtime';
import { Injectable } from '@nestjs/common';
import { ITwitchSubscription } from '@twitch/interfaces/twitch-subscription';
import { ITwitchUser } from '@twitch/interfaces/twitch-user';
import { TwitchApiService } from '@twitch/services/twitch-api';

@Injectable()
export class TwitchService {
  constructor(private readonly twitchApiService: TwitchApiService) {}

  // TODO: Paginar hasta encontrar o descartar al usuario
  async getSubscriptionById(id: string): Promise<ITwitchSubscription | null> {
    const subscriptions = await this.twitchApiService.getSubscriptions();
    return (
      subscriptions.find(
        (subscription) => subscription.condition.broadcaster_user_id === id,
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

    let subscription = await this.getSubscriptionById(user.id);

    return subscription || this.twitchApiService.createSubscription(user.id);
  }
}
