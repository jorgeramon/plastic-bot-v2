import { Injectable } from '@nestjs/common';
import { BaseGateway } from './base';
import { ExtendsCommand } from '@discord/decorators/extends-command';
import { Subcommand } from '@discord/decorators/subcommand';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { AdminChannelService } from '@admin/services/admin-channel';

@Injectable()
@ExtendsCommand()
export class ConfessionGateway extends BaseGateway {
  constructor(private readonly adminChannelService: AdminChannelService) {
    super();
  }

  @Subcommand({
    name: 'confesiones',
    description: 'Configura el canal para publicar confesiones',
    parameters: [
      {
        name: 'canal',
        description:
          'Canal donde se publicarán las confesiones al utilizar el comando',
        type: CommandParameterType.Channel,
        required: true,
      },
    ],
  })
  async setConfessionChannel(interaction: CommandInteraction) {
    await interaction.deferReply();

    const options = interaction.options as CommandInteractionOptionResolver;

    const channelId: string = options.getString('canal');
    await this.adminChannelService.setConfessionChannel(channelId);

    await interaction.editReply('Canal de confesiones actualizado');
  }
}
