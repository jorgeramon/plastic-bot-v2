import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AutoRoleMessageDocument = HydratedDocument<AutoRoleMessage>;

@Schema({ _id: false, timestamps: true })
export class AutoRoleConfig {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  emoji: string;
}

export const AutoRoleConfigSchema =
  SchemaFactory.createForClass(AutoRoleConfig);

@Schema({ timestamps: true })
export class AutoRoleMessage {
  @Prop({ required: true })
  message: string;

  @Prop({ type: [AutoRoleConfigSchema] })
  roles: AutoRoleConfig[];
}

export const AutoRoleMessageSchema =
  SchemaFactory.createForClass(AutoRoleMessage);
