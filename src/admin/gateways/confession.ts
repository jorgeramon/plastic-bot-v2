import { Injectable } from '@nestjs/common';
import { BaseGateway } from './base';
import { ExtendsCommand } from '@discord/decorators/extends-command';
import { Subcommand } from '@discord/decorators/subcommand';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import { CommandInteraction } from 'discord.js';
import { ChannelConfigService } from '@admin/services/channel-config';
import { ChannelType } from '@admin/enums/channel-type';

@Injectable()
@ExtendsCommand()
export class ConfessionGateway extends BaseGateway {
  constructor(private readonly channelConfigService: ChannelConfigService) {
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

    const channelId = interaction.options.get('canal').value as string;

    await this.channelConfigService.upsert({
      type: ChannelType.CONFESSION,
      channel: channelId,
    });

    await interaction.editReply('Canal de confesiones actualizado');
  }
}
