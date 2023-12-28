import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@discord/decorators/command';
import { CommandInteraction } from 'discord.js';
import { FunaService } from '@fun/services/funa';

@Injectable()
export class RandomGateway {
  private readonly logger: Logger = new Logger(RandomGateway.name);

  constructor(private readonly funaService: FunaService) {}

  @Command({
    name: 'puto',
    description: '¿Quién es puto?',
  })
  async whosPuto(interaction: CommandInteraction) {
    const randomUser = await this.funaService.getRandomFuned();
    interaction.reply(`<@${randomUser}> es puto 🏳️‍🌈`);
  }
}
