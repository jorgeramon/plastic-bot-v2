import { Injectable } from '@nestjs/common';
import { Subcommand } from '@discord/decorators/subcommand';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';
import { AutoRoleService } from '@admin/services/autorole';
import { ExtendsCommand } from '@discord/decorators/extends-command';
import { SubcommandGroup } from '@discord/decorators/subcommand-group';
import { BaseGateway } from '@admin/gateways/base';

@Injectable()
@ExtendsCommand()
@SubcommandGroup({
  name: 'autoroles',
  description: 'Comandos para administrar autoroles a cualquier mensaje',
})
export class AutoRoleGateway extends BaseGateway {
  constructor(private readonly autoroleService: AutoRoleService) {
    super();
  }

  @Subcommand({
    name: 'agregar',
    description: 'Agrega un rol al reaccionar a cierto emoji en un mensaje',
    parameters: [
      {
        name: 'id',
        description:
          'Identificador del mensaje para asignar roles a los usuarios',
        type: CommandParameterType.String,
        required: true,
      },
      {
        name: 'emoji',
        description:
          'Emoji al que deberá reaccionar el usuario para asignar el rol',
        type: CommandParameterType.String,
        required: true,
      },
      {
        name: 'rol',
        description: 'Rol que será asignado con la reacción del usuario',
        type: CommandParameterType.Role,
        required: true,
      },
    ],
  })
  async addAutoRole(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const options = interaction.options as CommandInteractionOptionResolver;

    const message: string = options.getString('id');
    const emoji: string = options.getString('emoji');
    const { id: role } = options.getRole('rol');

    await this.autoroleService.addAutoRole({ message, role, emoji });

    await interaction.editReply(
      'El auto rol ha sido configurado para ese mensaje 🤓',
    );
  }
}
