import { Controller, Get, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('enriched/:uuid')
  async getEnrichedUser(@Param('uuid') uuid: string) {
    if (!uuid || uuid.trim() === '') {
      throw new BadRequestException('UUID is required');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      throw new BadRequestException('Invalid UUID format');
    }

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
