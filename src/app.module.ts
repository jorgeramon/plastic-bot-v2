import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordModule } from '@discord/discord.module';
import { FunModule } from '@fun/fun.module';
import { Environment } from '@common/enums/environment';
import { AdminModule } from '@admin/admin.module';
import { StreamerModule } from '@streamer/streamer.module';

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
    AdminModule,
    StreamerModule,
  ],
})
export class AppModule {}
