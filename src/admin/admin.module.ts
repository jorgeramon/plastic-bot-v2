import { Module } from '@nestjs/common';
import { ConfessionGateway } from '@admin/gateways/confession';
import { ChannelConfigService } from '@admin/services/channel-config';
import {
  ChannelConfig,
  ChannelConfigSchema,
} from '@admin/schemas/channel-config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChannelConfig.name,
        schema: ChannelConfigSchema,
      },
    ]),
  ],
  providers: [ConfessionGateway, ChannelConfigService],
})
export class AdminModule {}
