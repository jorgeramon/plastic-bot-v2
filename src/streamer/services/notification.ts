import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ITwitchStream } from '@twitch/interfaces/twitch-stream';
import { TwitchStreamRx } from '@twitch/rxjs/twitch-stream';
import { StreamerService } from './streamer';

@Injectable()
export class NotificationService implements OnApplicationBootstrap {
  constructor(
    private readonly streamerService: StreamerService,
    private readonly twitchStreamRx: TwitchStreamRx,
  ) {}

  onApplicationBootstrap() {
    this.onTwitchNotification();
  }

  onTwitchNotification(): void {
    this.twitchStreamRx
      .onNotification()
      .subscribe((stream: ITwitchStream) => {});
  }
}
