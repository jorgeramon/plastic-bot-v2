import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChannelConfig,
  ChannelConfigSchema,
} from '@database/schemas/channel-config';
import { Funa, FunaSchema } from '@database/schemas/funa';
import { ChannelConfigRepository } from '@database/repositories/channel-config';
import { FunaRepository } from '@database/repositories/funa';
import {
  AutoRoleMessage,
  AutoRoleMessageSchema,
} from '@database/schemas/autorole-message';
import { AutoRoleMessageRepository } from '@database/repositories/autorole-message';
import { Streamer, StreamerSchema } from '@database/schemas/streamer';
import { StreamerRepository } from '@database/repositories/streamer';

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
      {
        name: AutoRoleMessage.name,
        schema: AutoRoleMessageSchema,
      },
      {
        name: Streamer.name,
        schema: StreamerSchema
      }
    ]),
  ],
  providers: [
    ChannelConfigRepository,
    FunaRepository,
    AutoRoleMessageRepository,
    StreamerRepository
  ],
  exports: [
    ChannelConfigRepository, 
    FunaRepository, 
    AutoRoleMessageRepository,
    StreamerRepository
  ],
})
export class DatabaseModule {}
