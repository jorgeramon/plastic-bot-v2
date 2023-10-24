import { Command } from '@discord/decorators/command';
import { Injectable } from '@nestjs/common';
import { PermissionFlagsBits } from 'discord.js';

@Injectable()
@Command({
  name: 'admin',
  description: 'Comandos de administración y configuración del servidor',
  permissions: [PermissionFlagsBits.ManageChannels],
})
export class BaseGateway {}
