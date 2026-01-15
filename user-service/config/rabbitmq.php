<?php

return [
    'host' => env('RABBITMQ_HOST'),
    'port' => env('RABBITMQ_PORT'),
    'user' => env('RABBITMQ_USER'),
    'password' => env('RABBITMQ_PASSWORD'),
    'exchange' => env('RABBITMQ_EXCHANGE'),
    'queue' => env('RABBITMQ_QUEUE'),
    'routing_key' => env('RABBITMQ_ROUTING_KEY'),
];
