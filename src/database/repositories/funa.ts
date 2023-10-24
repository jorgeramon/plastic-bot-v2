import { Funa, FunaDocument } from '@database/schemas/funa';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FunaRepository {
  constructor(@InjectModel(Funa.name) private model: Model<Funa>) {}

  async create(data: Funa): Promise<FunaDocument> {
    const document = new this.model(data);
    return document.save();
  }

  async findByTo(to: string): Promise<FunaDocument[]> {
    return this.model.find({ to }).exec();
  }
}
