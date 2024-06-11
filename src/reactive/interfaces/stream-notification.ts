import { Platform } from '@database/enums/platform';

export interface IStreamNotification {
  account: string;
  game: string;
  link: string;
  title: string;
  preview?: string;
  platform: Platform;
}
