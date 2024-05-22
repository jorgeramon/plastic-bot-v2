import { Injectable } from '@nestjs/common';
import { ITwitchStream } from '@twitch/interfaces/twitch-stream';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TwitchStreamRx {
  private readonly $notification = new Subject<ITwitchStream>();

  onNotification(): Observable<ITwitchStream> {
    return this.$notification.asObservable();
  }

  nextNotification(stream: ITwitchStream): void {
    this.$notification.next(stream);
  }
}
