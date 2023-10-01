import { Module } from '@nestjs/common';
import { ConversationGateway } from '@artificial-intelligence/gateways/conversation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ConversationGateway],
})
export class ArtificialIntelligenceModule {}
