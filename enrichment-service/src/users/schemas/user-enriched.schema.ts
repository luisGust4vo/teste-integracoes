import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserEnriched extends Document {
  @Prop({ unique: true })
  uuid: string;

  @Prop()
  linkedin: string;

  @Prop()
  github: string;
}

export const UserEnrichedSchema =
  SchemaFactory.createForClass(UserEnriched);
