import { Command } from '@discord/decorators/command';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { StreamerService } from '@streamer/services/streamer';
import { IStreamer } from '@streamer/interfaces/streamer';
import { Subcommand } from '@discord/decorators/subcommand';
import { ITwitchStreamer } from '@streamer/interfaces/twitch-streamer';

@Injectable()
@Command({
  name: 'twitch',
  description:
    'Vincula tu cuenta de Twitch para enviar notificaciones en el canal de #streams',
})
export class TwitchGateway {
  constructor(private readonly streamerService: StreamerService) {}

  @Subcommand({
    name: 'cuenta',
    description: 'Revisa la cuenta que tienes vinculada',
  })
  async read(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild } = interaction;

    const discord: string = interaction.user.id;

    const twitch: ITwitchStreamer | null =
      await this.streamerService.getTwitchAccountByDiscordAndGuild(
        discord,
        guild.id,
      );

    await interaction.editReply(
      twitch
        ? `La cuenta vinculada es: **${twitch.login}** 🤓☝️`
        : 'No has vinculado ninguna cuenta de Twitch 🥺',
    );
  }

  @Subcommand({
    name: 'vincular',
    description: 'Vincula tu cuenta de Twitch',
    parameters: [
      {
        name: 'cuenta',
        description: 'Nombre de la cuenta de Twitch que quieres vincular',
        type: CommandParameterType.String,
        required: true,
      },
    ],
  })
  async link(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild } = interaction;

    const options = interaction.options as CommandInteractionOptionResolver;

    const discord: string = interaction.user.id;
    const login: string = options.getString('cuenta');

    const streamer: ITwitchStreamer | null =
      await this.streamerService.getTwitchAccountByLoginAndGuild(
        login,
        guild.id,
      );

    if (streamer) {
      await interaction.editReply(
        streamer.discord === discord
          ? 'Ya tienes vinculada esta cuenta 😒'
          : 'Ésta cuenta ha sido vinculada por otra persona, si la cuenta es tuya por favor contacta a un administrador para resolver el caso.',
      );
    } else {
      await this.streamerService.createTwitchSubscription(
        discord,
        login,
        guild.id,
      );

      await interaction.editReply(
        'Tu cuenta ha sido vinculada. Recuerda que solo se enviarán notificaciones si haces directo de: **Guitar Hero, Rock Band, Rocksmith, Clone Hero, Yarg, Fortnite, Osu! y algunos juegos de ritmo más**.',
      );
    }
  }

  @Subcommand({
    name: 'desvincular',
    description: 'Desvincula tu cuenta de Twitch',
  })
  async unlink(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild } = interaction;

    const discord: string = interaction.user.id;

    const streamer: IStreamer | null =
      await this.streamerService.findStreamerByDiscordAndGuild(
        discord,
        guild.id,
      );

    if (streamer) {
      await this.streamerService.deleteTwitchSubscription(streamer);
    }

    await interaction.editReply(
      streamer
        ? `La cuenta ha sido desvinculada 🤓☝️`
        : 'No tienes ninguna cuenta vinculada 😒',
    );
  }
}
