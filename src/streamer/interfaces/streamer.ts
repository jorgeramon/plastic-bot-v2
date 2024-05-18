import { Platform } from "@database/enums/platform";

export interface IStreamer {
  discord: string;
  account: string;
  platform: Platform;
}