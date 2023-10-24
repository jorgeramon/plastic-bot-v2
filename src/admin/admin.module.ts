import { Module } from '@nestjs/common';
import { ConfessionGateway } from '@admin/gateways/confession';
import { DatabaseModule } from '@database/database.module';
import { AdminChannelService } from './services/admin-channel';

@Module({
  imports: [DatabaseModule],
  providers: [ConfessionGateway, AdminChannelService],
})
export class AdminModule {}
