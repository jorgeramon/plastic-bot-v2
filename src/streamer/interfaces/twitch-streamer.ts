import { IStreamer } from './streamer';

export interface ITwitchStreamer extends IStreamer {
  login: string;
  profile: string;
}
