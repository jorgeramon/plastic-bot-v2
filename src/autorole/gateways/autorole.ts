import { Injectable } from '@nestjs/common';
import { Subcommand } from '@discord/decorators/subcommand';
import { CommandParameterType } from '@discord/enums/command-parameter-type';
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionFlagsBits,
} from 'discord.js';
import { Command } from '@discord/decorators/command';
import { AutoRoleService } from '@autorole/services/autorole';

@Injectable()
@Command({
  name: 'autorol',
  description: 'Comandos para agregar auto roles a cualquier mensaje',
  permissions: [PermissionFlagsBits.ManageMessages],
})
export class AutoRoleGateway {
  constructor(private readonly autoroleService: AutoRoleService) {}

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
