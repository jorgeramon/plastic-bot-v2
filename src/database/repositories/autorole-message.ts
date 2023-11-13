import {
  AutoRoleMessage,
  AutoRoleMessageDocument,
} from '@database/schemas/autorole-message';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AutoRoleMessageRepository {
  constructor(
    @InjectModel(AutoRoleMessage.name) private model: Model<AutoRoleMessage>,
  ) {}

  findOneByMessage(message: string): Promise<AutoRoleMessageDocument> {
    return this.model.findOne({ message }).exec();
  }

  upsertPush(
    message: string,
    role: string,
    emoji: string,
  ): Promise<AutoRoleMessageDocument> {
    return this.model.findOneAndUpdate(
      { message },
      { $push: { roles: { role, emoji } } },
      { new: true, upsert: true },
    );
  }
}
