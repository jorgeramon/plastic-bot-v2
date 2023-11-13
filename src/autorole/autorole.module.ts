import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { AutoRoleGateway } from '@autorole/gateways/autorole';

@Module({
  imports: [DatabaseModule],
  providers: [AutoRoleGateway],
})
export class AutoRoleModule {}
