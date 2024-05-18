import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AutoRoleConfig, AutoRoleConfigSchema } from './autorole-config';

export type AutoRoleMessageDocument = HydratedDocument<AutoRoleMessage>;

@Schema({ timestamps: true })
export class AutoRoleMessage {
  @Prop({ required: true })
  message: string;

  @Prop({ type: [AutoRoleConfigSchema] })
  roles: AutoRoleConfig[];
}

export const AutoRoleMessageSchema =
  SchemaFactory.createForClass(AutoRoleMessage);
