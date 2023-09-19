import { IFuna } from '@fun/interfaces/funa';
import { Funa, FunaDocument } from '@fun/schemas/funa';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FunaService {
  constructor(@InjectModel(Funa.name) private model: Model<Funa>) {}

  async create(data: IFuna): Promise<FunaDocument> {
    const createdDocument = new this.model(data);
    return createdDocument.save();
  }

  async findByTo(to: string): Promise<FunaDocument[]> {
    return this.model.find({ to }).exec();
  }
}
