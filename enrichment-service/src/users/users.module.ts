import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEnriched, UserEnrichedSchema } from './schemas/user-enriched.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEnriched.name, schema: UserEnrichedSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
