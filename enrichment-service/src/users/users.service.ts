import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEnriched } from './schemas/user-enriched.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEnriched.name)
    private userEnrichedModel: Model<UserEnriched>,
  ) {}

  async enrichUser(uuid: string, name: string) {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    
    const enrichedData = {
      uuid,
      linkedin: `linkedin.com/in/${normalizedName}`,
      github: `github.com/${normalizedName}`,
    };

    await this.userEnrichedModel.findOneAndUpdate(
      { uuid },
      enrichedData,
      { upsert: true, new: true },
    );

    return enrichedData;
  }

  async getEnrichedUser(uuid: string) {
    return this.userEnrichedModel.findOne({ uuid }).exec();
  }
}
