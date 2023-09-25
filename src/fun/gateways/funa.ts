import { Command } from '@discord/decorators/command';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { FunaService } from '@fun/services/funa';
import { Injectable } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';
import { sample } from 'lodash';

const autoFunaMessages = [
  '¿Todo bien en casa? 🤨',
  '**¡JAJAJA!** el pendejo, el pendejo 🤣',
];

const botFunaMessages = ['**¡¡JAJAJA QUE TONTO!!** quizo funar a un bot 🤡'];

@Injectable()
export class FunaGateway {
  constructor(private readonly funaService: FunaService) {}

  @Command({
    name: 'funa',
    description: '¡Funa a alguien!',
    parameters: [
      {
        name: 'usuario',
        description: '¿A quién vas a funar?',
        type: CommandParameterType.User,
        required: true,
      },
    ],
  })
  async funa(interaction: CommandInteraction) {
    await interaction.deferReply();

    const userId = interaction.options.get('usuario').value as string;

    if (userId === interaction.user.id) {
      await interaction.editReply(sample(autoFunaMessages));
      return;
    }

    const user = await interaction.client.users.fetch(userId);

    if (user.bot) {
      await interaction.editReply(sample(botFunaMessages));
      return;
    }

    await this.funaService.create({
      from: interaction.user.id,
      to: userId,
    });

    await interaction.editReply(`<@${user.id}> ha sido funado!`);
  }

  @Command({
    name: 'funas',
    description: '¿Cuántas veces has sido funado?',
  })
  async funas(interaction: CommandInteraction) {
    await interaction.deferReply();

    const funas = await this.funaService.findByTo(interaction.user.id);

    await interaction.editReply(
      funas.length === 0
        ? 'No has sido funado todavía 😡'
        : funas.length === 1
        ? 'Sólo tienes **1** funa 🙄'
        : `Has sido funado **${funas.length}** veces 😏`,
    );
  }
}
