import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: true })
export class AutoRoleConfig {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  emoji: string;
}

export const AutoRoleConfigSchema =
  SchemaFactory.createForClass(AutoRoleConfig);
