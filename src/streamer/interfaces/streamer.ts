import { Platform } from '@database/enums/platform';

export interface IStreamer {
  _id: string;
  discord: string;
  account: string;
  platform: Platform;
}
