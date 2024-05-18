import { Command } from "@discord/decorators/command";
import { CommandParameterType } from "@discord/enums/command-parameter-type";
import { Injectable } from "@nestjs/common";
import { CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { StreamerService } from '@streamer/services/streamer';
import { Platform } from "@database/enums/platform";
import { IStreamer } from "@streamer/interfaces/streamer";

@Injectable()
export class AccountGateway {

  constructor(private readonly streamerService: StreamerService) {}

  @Command({
    name: 'twitch',
    description: 'Vincula tu cuenta de Twitch para enviar notificaciones en el canal de #streams',
    parameters: [
      {
        name: 'cuenta',
        description: 'Nombre de la cuenta de Twitch que quieres vincular',
        type: CommandParameterType.String
      }
    ]
  })
  async twitchAccount(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const options = interaction.options as CommandInteractionOptionResolver;
    
    const discord: string = interaction.user.id;
    const account: string = options.getString('cuenta');

    if (!account) {
      const twitch: IStreamer | null = await this.streamerService.findTwitchAccount(discord);
      await interaction.editReply(
        twitch ? `La cuenta vinculada es: **${twitch.account}** 🤓☝️`
          : 'No has vinculado ninguna cuenta de Twitch 🥺');
    } else {
      await this.streamerService.upsertTwitchAccount(discord, account);
      await interaction.editReply('Tu cuenta ha sido vinculada. Recuerda que solo se enviarán notificaciones si haces directo de: **Guitar Hero**, **Rock Band**, **Rocksmith**, **Clone Hero**, **YARG** y **Fortnite**.')
    }
  }
  
}