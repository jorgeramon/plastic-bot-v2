import { Command } from '@discord/decorators/command';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { ConfessionService } from '@fun/services/confession';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { sample } from 'lodash';

@Injectable()
export class ConfessionGateway {
  constructor(private readonly confessionService: ConfessionService) {}

  @Command({
    name: 'confesion',
    description: 'Cuéntanos tus más oscuros secretos de manera anónima',
    parameters: [
      {
        name: 'mensaje',
        description: 'No le diremos nada a nadie',
        type: CommandParameterType.String,
        required: true,
      },
      {
        name: 'quitar-anonimato',
        description:
          'Si es activada ésta opción (True), la confesión será pública',
        type: CommandParameterType.Boolean,
      },
    ],
  })
  async sendConfession(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const options = interaction.options as CommandInteractionOptionResolver;

    const { guild } = interaction;
    const { channels } = guild;
    const message: string = options.getString('mensaje');
    const isPublic: boolean = options.getBoolean('quitar-anonimato', false);

    const emojis: string[] = [
      '😆',
      '🤨',
      '🤔',
      '😯',
      '🤐',
      '😲',
      '😦',
      '😏',
      '🤫',
    ];

    let embededMessage: Record<string, any> = { description: message };

    if (isPublic) {
      embededMessage = {
        ...embededMessage,
        title: `Confesión de ${interaction.user.username} ${sample(emojis)}`,
        color: '#69F0AE',
        thumbnail: { url: interaction.user.avatarURL() },
      };
    } else {
      embededMessage = {
        ...embededMessage,
        title: `Confesión anónima ${sample(emojis)}`,
        color: '#EE2625',
      };
    }

    const channelId = await this.confessionService.getChannel(guild.id);

    if (!channelId) {
      return interaction.editReply(
        'El canal para enviar confesiones aún no ha sido configurado 💀 Avisa a un Administrador para que lo configure a través del bot.',
      );
    }

    try {
      const channel = await channels.fetch(channelId);

      await (channel as TextChannel).send({
        embeds: [
          EmbedBuilder.from(embededMessage)
            .setColor(embededMessage.color)
            .toJSON(),
        ],
      });

      await interaction.editReply('Confesión enviada');
    } catch (e) {
      if (e.code === 10003) {
        await interaction.editReply(
          'El canal para enviar confesiones no existe 💀 Avisa a un Administrador para que lo configure a través del bot.',
        );
      } else {
        throw e;
      }
    }
  }
}
