import { Injectable } from '@nestjs/common';
import { Command } from '@discord/decorators/command';
import { CommandInteraction } from 'discord.js';

@Injectable()
export class RandomGateway {
  @Command({
    name: 'puto',
    description: '¿Quién es puto?',
  })
  async whosPuto(interaction: CommandInteraction) {
    const roles = await interaction.guild.roles.fetch();

    const funnyRoles = roles.filter(
      (role) =>
        role.name.includes('tonto') ||
        role.name.includes('puto') ||
        role.name.includes('cuties') ||
        role.name.includes('gay') ||
        role.name.includes('gordo') ||
        role.position === roles.size - 1,
    );

    const randomUser = funnyRoles.random().members.random();
    interaction.reply(`<@${randomUser.id}> es **puto**`);
  }
}
