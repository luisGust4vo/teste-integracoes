# Sistema de Gerenciamento de Usuários com Enriquecimento de Dados

Sistema completo de gerenciamento de usuários com arquitetura de microsserviços, comunicação assíncrona via fila de mensagens e enriquecimento de dados.

## 🏗️ Arquitetura

- **Frontend**: React + TypeScript + Vite
- **User Service**: PHP (Laravel) + PostgreSQL
- **Enrichment Service**: Node.js (NestJS) + MongoDB
- **Message Queue**: RabbitMQ
- **Containerização**: Docker + Docker Compose

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Como Executar

### Subir toda a aplicação

```bash
docker-compose up -d
```

Este comando irá:
1. Criar e iniciar todos os containers (PostgreSQL, MongoDB, RabbitMQ, User Service, Enrichment Service, Frontend)
2. Configurar as redes e volumes necessários
3. Executar as migrations do banco de dados

### Acessar os serviços

- **Frontend**: http://localhost:5173
- **User Service API**: http://localhost:8000/api
- **Enrichment Service API**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672 (user: guest, password: guest)

### Parar a aplicação

```bash
docker-compose down
```

### Parar e remover volumes

```bash
docker-compose down -v
```

## 📡 Endpoints da API

### User Service (PHP/Laravel)

#### POST /api/users
Cria um novo usuário e publica evento na fila.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Response (201):**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

#### GET /api/users
Lista todos os usuários.

**Response (200):**
```json
[
  {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com"
  }
]
```

#### GET /api/users/{id}
Busca um usuário específico.

**Response (200):**
```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

### Enrichment Service (Node.js/NestJS)

#### GET /users/enriched/{uuid}
Busca dados enriquecidos de um usuário.

**Response (200):**
```json
{
  "linkedin": "linkedin.com/in/joaosilva",
  "github": "github.com/joaosilva"
}
```

**Response (404):**
```json
{
  "statusCode": 404,
  "message": "User not found or not yet processed"
}
```

## 🔄 Fluxo de Dados

1. **Criação de Usuário**: Frontend envia POST para User Service
2. **Persistência**: User Service salva no PostgreSQL e gera UUID
3. **Publicação**: User Service publica mensagem na fila RabbitMQ
4. **Consumo**: Enrichment Service consome mensagem da fila
5. **Enriquecimento**: Enrichment Service gera dados sociais fictícios
6. **Persistência**: Enrichment Service salva no MongoDB
7. **Consulta**: Frontend busca dados do User Service e Enrichment Service

## 🛡️ Tratamento de Erros

### User Service
- Validação de campos obrigatórios (name mínimo 3 caracteres, email válido)
- Transações de banco de dados com rollback em caso de falha
- Retorno de mensagens de erro claras

### Enrichment Service
- **Retry**: Mensagens com falha são rejeitadas (nack) sem requeue
- **Dead Letter Queue**: Configurável para mensagens que falharam múltiplas vezes
- **Logging**: Todas as operações são logadas para debugging

## 🗂️ Estrutura do Projeto

```
.
├── docker-compose.yml          # Orquestração de todos os serviços
├── frontend/                   # Aplicação React
├── user-service/              # API PHP/Laravel
│   ├── app/
│   ├── database/migrations/
│   └── routes/api.php
└── enrichment-service/        # API Node.js/NestJS
    ├── src/
    │   ├── users/
    │   └── rabbitmq/
    └── Dockerfile
```

## 🔧 Variáveis de Ambiente

Cada serviço possui seu arquivo `.env.example` com as variáveis necessárias.

## 📝 Notas Técnicas

- **Migrations**: O User Service executa migrations automaticamente ao iniciar
- **UUID v4**: Utilizado como identificador universal entre serviços
- **CORS**: Habilitado em ambos os serviços para comunicação com o frontend
- **Normalização**: Nomes de usuário são normalizados (lowercase, sem espaços) para gerar links sociais
