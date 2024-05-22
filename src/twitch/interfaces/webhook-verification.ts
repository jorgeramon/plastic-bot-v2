import { ITwitchSubscription } from './twitch-subscription';

export interface IWebhookVerification {
  challenge: string;
  subscription: ITwitchSubscription;
}
