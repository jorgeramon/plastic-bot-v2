import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Funa, FunaSchema } from '@fun/schemas/funa';
import { FunaGateway } from '@fun/gateways/funa';
import { FunaService } from '@fun/services/funa';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Funa.name,
        schema: FunaSchema,
      },
    ]),
  ],
  providers: [FunaGateway, FunaService],
})
export class FunModule {}
