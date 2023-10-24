import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChannelConfig,
  ChannelConfigSchema,
} from '@database/schemas/channel-config';
import { Funa, FunaSchema } from '@database/schemas/funa';
import { ChannelConfigRepository } from '@database/repositories/channel-config';
import { FunaRepository } from '@database/repositories/funa';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChannelConfig.name,
        schema: ChannelConfigSchema,
      },
      {
        name: Funa.name,
        schema: FunaSchema,
      },
    ]),
  ],
  providers: [ChannelConfigRepository, FunaRepository],
  exports: [ChannelConfigRepository, FunaRepository],
})
export class DatabaseModule {}
