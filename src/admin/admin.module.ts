import { Module } from '@nestjs/common';
import { ChannelGateway } from '@admin/gateways/channel';
import { DatabaseModule } from '@database/database.module';
import { AdminChannelService } from '@admin/services/admin-channel';
import { AutoRoleService } from '@admin/services/autorole';
import { AutoRoleGateway } from '@admin/gateways/autorole';

@Module({
  imports: [DatabaseModule],
  providers: [
    ChannelGateway,
    AutoRoleGateway,
    AdminChannelService,
    AutoRoleService,
  ],
})
export class AdminModule {}
