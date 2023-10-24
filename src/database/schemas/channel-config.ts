import { ChannelType } from '@database/enums/channel-type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChannelConfigDocument = HydratedDocument<ChannelConfig>;

@Schema({ timestamps: true })
export class ChannelConfig {
  @Prop({ required: true, enum: Object.values(ChannelType) })
  type: ChannelType;

  @Prop({ required: true })
  channel: string;
}

export const ChannelConfigSchema = SchemaFactory.createForClass(ChannelConfig);
