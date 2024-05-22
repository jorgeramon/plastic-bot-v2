import { ITwitchEvent } from './twitch-event';
import { ITwitchSubscription } from './twitch-subscription';

export interface ITwitchNotification {
  subscription: ITwitchSubscription;
  event: ITwitchEvent;
}
