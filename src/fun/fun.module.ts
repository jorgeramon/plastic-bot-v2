import { Module } from '@nestjs/common';
import { FunaGateway } from '@fun/gateways/funa';
import { ConfessionGateway } from '@fun/gateways/confession';
import { DatabaseModule } from '@database/database.module';
import { FunaService } from '@fun/services/funa';
import { ConfessionService } from '@fun/services/confession';

@Module({
  imports: [DatabaseModule],
  providers: [FunaGateway, ConfessionGateway, FunaService, ConfessionService],
})
export class FunModule {}
