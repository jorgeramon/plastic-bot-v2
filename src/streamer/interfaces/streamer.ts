import { Platform } from '@database/enums/platform';

export interface IStreamer<T = any> {
  _id: string;
  discord: string;
  account: string;
  guild: string;
  platform: Platform;
  metadata?: T;
}
