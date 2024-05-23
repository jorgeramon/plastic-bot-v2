import { Platform } from '@database/enums/platform';

export interface IStreamNotification {
  account: string;
  game: string;
  platform: Platform;
}
