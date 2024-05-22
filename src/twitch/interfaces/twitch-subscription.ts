interface ITwitchSubscriptionCondition {
  broadcaster_user_id: string;
  moderator_user_id: string;
}

interface ITwitchSubscriptionTransport {
  method: string;
  callback: string;
}

export interface ITwitchSubscription {
  id: string;
  status: string;
  type: string;
  version: number;
  cost: number;
  condition: ITwitchSubscriptionCondition;
  transport: ITwitchSubscriptionTransport;
  created_at: string;
}
