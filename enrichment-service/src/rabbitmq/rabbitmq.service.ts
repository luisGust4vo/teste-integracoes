import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { UsersService } from '../users/users.service';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.connect();
    await this.consumeMessages();
  }

  private async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('user.enrichment', { durable: true });
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ');
      this.logger.error(error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async consumeMessages() {
    if (!this.channel) {
      this.logger.warn('Channel not ready, skipping consume');
      return;
    }

    this.channel.consume(
      'user.enrichment',
      async (msg) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
            this.logger.log(`Processing message: ${JSON.stringify(data)}`);
            
            if (!data.uuid || !data.name) {
              throw new Error('Invalid message format: missing uuid or name');
            }
            
            await this.usersService.enrichUser(data.uuid, data.name);
            
            this.channel.ack(msg);
            this.logger.log(`Message processed successfully: ${data.uuid}`);
          } catch (error) {
            this.logger.error(`Error processing message: ${error.message}`, error.stack);
            this.channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  }
}
