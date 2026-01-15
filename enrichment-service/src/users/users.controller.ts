import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('enriched/:uuid')
  async getEnrichedUser(@Param('uuid') uuid: string) {
    const user = await this.usersService.getEnrichedUser(uuid);
    
    if (!user) {
      throw new NotFoundException('User not found or not yet processed');
    }

    return {
      linkedin: user.linkedin,
      github: user.github,
    };
  }
}
