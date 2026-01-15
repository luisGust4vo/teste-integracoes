<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService
{
    private $connection;
    private $channel;

    public function __construct()
    {
        try {
            $this->connection = new AMQPStreamConnection(
                config('rabbitmq.host'),
                config('rabbitmq.port'),
                config('rabbitmq.user'),
                config('rabbitmq.password')
            );

            $this->channel = $this->connection->channel();

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
        } catch (\Exception $e) {
            \Log::error('Erro ao conectar no RabbitMQ: ' . $e->getMessage());
            throw $e;
        }
    }

    public function publish(array $payload): void
    {
        $message = new AMQPMessage(
            json_encode($payload),
            [
                'content_type' => 'application/json',
                'delivery_mode' => 2 // Persistent
            ]
        );

        $this->channel->basic_publish(
            $message,
            config('rabbitmq.exchange'),
            config('rabbitmq.routing_key')
        );
    }

    public function __destruct()
    {
        if ($this->channel) {
            $this->channel->close();
        }
        if ($this->connection) {
            $this->connection->close();
        }
    }
}
