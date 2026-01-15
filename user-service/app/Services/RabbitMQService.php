<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService
{
    private $channel;

    public function __construct()
    {
        $connection = new AMQPStreamConnection(
            config('rabbitmq.host'),
            config('rabbitmq.port'),
            config('rabbitmq.user'),
            config('rabbitmq.password')
        );

        $this->channel = $connection->channel();

        // Exchange
        $this->channel->exchange_declare(
            config('rabbitmq.exchange'),
            'direct',
            false,
            true,
            false
        );

        // Queue
        $this->channel->queue_declare(
            config('rabbitmq.queue'),
            false,
            true,
            false,
            false
        );

        // Bind
        $this->channel->queue_bind(
            config('rabbitmq.queue'),
            config('rabbitmq.exchange'),
            config('rabbitmq.routing_key')
        );
    }

    public function publish(array $payload): void
    {
        $message = new AMQPMessage(
            json_encode($payload),
            [
                'content_type' => 'application/json',
                'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT
            ]
        );

        $this->channel->basic_publish(
            $message,
            config('rabbitmq.exchange'),
            config('rabbitmq.routing_key')
        );
    }
}
