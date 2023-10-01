import { Mention } from '@discord/decorators/mention';
import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';

@Injectable()
export class ConversationGateway {
  @Mention()
  async conversation(message: Message) {
    const content = message.content.replace(/<[@#!&](.*?)>/g, '').trim();
  }
}
