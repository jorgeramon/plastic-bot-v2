import { Command } from '@discord/decorators/command';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { Injectable } from '@nestjs/common';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { StreamerService } from '@streamer/services/streamer';
import { Platform } from '@database/enums/platform';
import { IStreamer } from '@streamer/interfaces/streamer';
import { Subcommand } from '@discord/decorators/subcommand';

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

    const discord: string = interaction.user.id;

    const twitch: IStreamer | null =
      await this.streamerService.findTwitchAccount(discord);

    await interaction.editReply(
      twitch
        ? `La cuenta vinculada es: **${twitch.account}** 🤓☝️`
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

    const options = interaction.options as CommandInteractionOptionResolver;

    const discord: string = interaction.user.id;
    const account: string = options.getString('cuenta');

    const existing: IStreamer | null =
      await this.streamerService.findTwitchAccountByName(account);

    if (existing) {
      await interaction.editReply(
        existing.discord === discord
          ? 'Ya tienes vinculada esta cuenta 😒'
          : 'Ésta cuenta ha sido vinculada por otra persona, si la cuenta es tuya por favor contacta a un administrador para resolver el caso.',
      );
    } else {
      await this.streamerService.upsertTwitchAccount(discord, account);
      await interaction.editReply(
        'Tu cuenta ha sido vinculada. Recuerda que solo se enviarán notificaciones si haces directo de: **Guitar Hero**, **Rock Band**, **Rocksmith**, **Clone Hero**, **YARG** y **Fortnite**.',
      );
    }
  }

  @Subcommand({
    name: 'desvincular',
    description: 'Desvincula tu cuenta de Twitch',
  })
  async unlink(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const discord: string = interaction.user.id;

    const twitch: IStreamer | null =
      await this.streamerService.findTwitchAccount(discord);

    if (twitch) {
      await this.streamerService.deleteAccount(twitch._id);
    }

    await interaction.editReply(
      twitch
        ? `La cuenta ha sido desvinculada 🤓☝️`
        : 'No tienes ninguna cuenta vinculada 😒',
    );
  }
}
