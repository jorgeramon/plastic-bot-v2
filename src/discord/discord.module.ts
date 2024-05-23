import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DiscordClient } from '@discord/services/discord-client';
import { CommandDiscovery } from '@discord/services/command-discovery';
import { DiscordBot } from '@discord/services/discord-bot';
import { DatabaseModule } from '@database/database.module';
import { NotificationService } from '@discord/services/notification';
import { ReactiveModule } from '@reactive/reactive.module';

@Module({
  imports: [ConfigModule, DiscoveryModule, DatabaseModule, ReactiveModule],
  providers: [DiscordClient, CommandDiscovery, DiscordBot, NotificationService],
})
export class DiscordModule {}
