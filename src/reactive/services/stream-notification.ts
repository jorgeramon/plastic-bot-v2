import { IStreamNotification } from '@reactive/interfaces/stream-notification';
import { Observable, Subject } from 'rxjs';

export class StreamNotificationRx {
  private readonly $notification = new Subject<IStreamNotification>();

  onNotification(): Observable<IStreamNotification> {
    return this.$notification.asObservable();
  }

  nextNotification(stream: IStreamNotification): void {
    this.$notification.next(stream);
  }
}
