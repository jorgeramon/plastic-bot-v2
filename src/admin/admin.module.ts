import { Module } from '@nestjs/common';
import { ConfessionGateway } from '@admin/gateways/confession';
import { DatabaseModule } from '@database/database.module';
import { AdminChannelService } from '@admin/services/admin-channel';
import { AutoRoleService } from '@admin/services/autorole';
import { AutoRoleGateway } from '@admin/gateways/autorole';

@Module({
  imports: [DatabaseModule],
  providers: [
    ConfessionGateway,
    AutoRoleGateway,
    AdminChannelService,
    AutoRoleService,
  ],
})
export class AdminModule {}
