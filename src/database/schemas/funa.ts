import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FunaDocument = HydratedDocument<Funa>;

@Schema({ timestamps: true })
export class Funa {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;
}

export const FunaSchema = SchemaFactory.createForClass(Funa);
