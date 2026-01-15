import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [RabbitMQService],
})
export class RabbitMQModule {}
