import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { AutoRoleGateway } from '@autorole/gateways/autorole';
import { AutoRoleService } from './services/autorole';

@Module({
  imports: [DatabaseModule],
  providers: [AutoRoleGateway, AutoRoleService],
})
export class AutoRoleModule {}
