import { Funa, FunaDocument } from '@database/schemas/funa';
import { IFuna } from '@fun/interfaces/funa';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FunaRepository {
  constructor(@InjectModel(Funa.name) private model: Model<Funa>) {}

  async create(data: Funa): Promise<IFuna> {
    const document: FunaDocument = await (new this.model(data).save());
    return document.toJSON();
  }

  async findByTo(to: string): Promise<IFuna[]> {
    const documents: FunaDocument[] = await this.model.find({ to }).exec();
    return documents.map((document) => document.toJSON());
  }

  async getUniqueFunedUsers(): Promise<string[]> {
    const data = await this.model.aggregate(
      [
        {
          $group: {
            _id: null,
            users: { $addToSet: "$to"}
          }
        }
      ]
    ).exec();

    return data.length ? data[0].users : [];
  }
}
