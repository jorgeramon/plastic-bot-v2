import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DiscordClient } from '@discord/services/discord-client';
import { CommandDiscovery } from '@discord/services/command-discovery';
import { DiscordBot } from './services/discord-bot';

@Module({
  imports: [ConfigModule, DiscoveryModule],
  providers: [DiscordClient, CommandDiscovery, DiscordBot],
})
export class DiscordModule {}
