import { Decorator } from '@discord/enums/decorator';
import { CommandMetadata } from '@discord/interfaces/command-metadata';
import { CommandOptions } from '@discord/interfaces/command-options';
import { DiscordCommand } from '@discord/interfaces/discord-command';
// import { SubcommandGroupOptions } from '@discord/interfaces/subcommand-group-options';
// import { SubcommandOptions } from '@discord/interfaces/subcommand-options';
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { isObject } from 'lodash';

@Injectable()
export class CommandDiscovery {
  private readonly logger: Logger = new Logger(CommandDiscovery.name);
  private metadata: CommandMetadata[];
  private commands: DiscordCommand[];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  discoverCommands(): void {
    this.metadata = this.scanCommands();
    this.commands = this.getHierarchy(this.metadata);
  }

  getMetadata(): CommandMetadata[] {
    return this.metadata;
  }

  getCommands(): DiscordCommand[] {
    return this.commands;
  }

  private scanCommands(): CommandMetadata[] {
    this.logger.log('Scanning commands');

    return this.discoveryService
      .getProviders()
      .map((wrapper: InstanceWrapper) => wrapper.instance)
      .filter((instance) => !!instance && isObject(instance))
      .map((instance) =>
        this.metadataScanner
          .getAllMethodNames(instance)
          .map((methodName) => this.scanCommandsMetadata(instance, methodName)),
      )
      .flat()
      .filter((instance) => !!instance);
  }

  private scanCommandsMetadata(
    instance: any,
    method: string,
  ): CommandMetadata | null {
    const isMention: boolean = !!Reflect.getMetadata(
      Decorator.MENTION,
      instance,
      method,
    );

    if (isMention) {
      return {
        instance,
        method,
        isMention: true,
      };
    }

    const commandMetadata: CommandOptions = Reflect.getMetadata(
      Decorator.COMMAND,
      instance,
      method,
    );

    if (!commandMetadata) {
      return null;
    }

    /*
    const subcommandMetadata: SubcommandOptions = Reflect.getMetadata(
      Decorator.SUBCOMMAND,
      instance,
      method,
    );

    const subcommandGroupMetadata: SubcommandGroupOptions = Reflect.getMetadata(
      Decorator.SUBCOMMAND_GROUP,
      instance,
      method,
    );*/

    return {
      instance,
      method,
      isMention: false,
      command: commandMetadata,
      // subcommand: subcommandMetadata,
      // subcommandGroup: subcommandGroupMetadata,
    };
  }

  private getHierarchy(commands: CommandMetadata[]): DiscordCommand[] {
    this.logger.log('Getting commands hierarchy');

    return [
      ...commands
        .filter((command) => !command.isMention)
        .reduce((map, metadata) => {
          const { command } = metadata;
          map.set(command.name, {
            ...command,
            subcommands: [],
            subcommandGroups: [],
          });
          return map;
        }, new Map<string, DiscordCommand>())
        .values(),
    ];

    /*for (const {
      command,
      subcommand,
      subcommandGroup,
      isMention,
    } of commands) {
      if (!tmpMemory.has(command.name)) {
        tmpMemory.set(command.name, {
          ...command,
          subcommandGroups: [],
          subcommands: [],
        });
      }

      const { subcommandGroups, subcommands } = tmpMemory.get(command.name);

      if (subcommandGroup) {
        let group = subcommandGroups.find(
          (c) => c.name === subcommandGroup.name,
        );

        if (!group) {
          group = { ...subcommandGroup, subcommands: [] };
          subcommandGroups.push(group);
        }

        group.subcommands.push(subcommand);
      } else if (subcommand) {
        subcommands.push(subcommand);
      }
    }

    return [...tmpMemory.values()];*/
  }
}
