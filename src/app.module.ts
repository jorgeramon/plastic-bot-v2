import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordModule } from '@discord/discord.module';
import { FunModule } from '@fun/fun.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from '@common/enums/environment';
import { ArtificialIntelligenceModule } from '@artificial-intelligence/artificial-intelligence.module';
import { AdminModule } from '@admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(Environment.MONGO_ATLAS),
      }),
    }),
    DiscordModule,
    FunModule,
    ArtificialIntelligenceModule,
    AdminModule,
  ],
})
export class AppModule {}
