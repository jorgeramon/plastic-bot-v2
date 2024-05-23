import { Module } from '@nestjs/common';
import { StreamNotificationRx } from './services/stream-notification';

@Module({
  providers: [StreamNotificationRx],
  exports: [StreamNotificationRx],
})
export class ReactiveModule {}
