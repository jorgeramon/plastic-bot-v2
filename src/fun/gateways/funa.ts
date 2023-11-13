import { Command } from '@discord/decorators/command';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { sample } from 'lodash';
import { FunaService } from '@fun/services/funa';

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

    const options = interaction.options as CommandInteractionOptionResolver;

    const userId: string = options.getString('usuario');

    if (userId === interaction.user.id) {
      await interaction.editReply(sample(autoFunaMessages));
      return;
    }

    const user = await interaction.client.users.fetch(userId);

    if (user.bot) {
      await interaction.editReply(sample(botFunaMessages));
      return;
    }

    await this.funaService.giveFuna(interaction.user.id, userId);

    await interaction.editReply(`<@${user.id}> ha sido funado!`);
  }

  @Command({
    name: 'funas',
    description: '¿Cuántas veces has sido funado?',
  })
  async funas(interaction: CommandInteraction) {
    await interaction.deferReply();

    const count = await this.funaService.countReceivedFunas(
      interaction.user.id,
    );

    await interaction.editReply(
      count === 0
        ? 'No has sido funado todavía 😡'
        : count === 1
        ? 'Sólo tienes **1** funa 🙄'
        : `Has sido funado **${count}** veces 😏`,
    );
  }
}
