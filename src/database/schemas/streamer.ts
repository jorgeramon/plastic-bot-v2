import { Platform } from '@database/enums/platform';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StreamerDocument = HydratedDocument<Streamer>;

@Schema({ timestamps: true })
export class Streamer {
  @Prop({ required: true })
  discord: string;

  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  platform: Platform;
}

export const StreamerSchema = SchemaFactory.createForClass(Streamer);
