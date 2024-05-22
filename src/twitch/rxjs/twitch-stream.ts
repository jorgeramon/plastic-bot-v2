import { ITwitchStream } from '@twitch/interfaces/twitch-stream';
import { Observable, Subject } from 'rxjs';

export class TwitchStreamRx {
  private readonly $notification = new Subject<ITwitchStream>();

  onNotification(): Observable<ITwitchStream> {
    return this.$notification.asObservable();
  }

  nextNotification(stream: ITwitchStream): void {
    this.$notification.next(stream);
  }
}
