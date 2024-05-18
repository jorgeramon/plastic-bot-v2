import { IAutoRole } from '@admin/interfaces/autorole';
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

  async findOneByMessage(message: string): Promise<IAutoRole | null> {
    const document: AutoRoleMessageDocument | null = await this.model.findOne({ message }).exec();
    return document !== null ? document.toJSON() : null;
  }

  async upsertPush(
    message: string,
    role: string,
    emoji: string,
  ): Promise<IAutoRole> {
    const document: AutoRoleMessageDocument = await this.model.findOneAndUpdate(
      { message },
      { $push: { roles: { role, emoji } } },
      { new: true, upsert: true },
    );

    return document.toJSON();
  }
}
