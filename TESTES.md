# Testes da Aplicação

## 1. Verificar se todos os serviços estão rodando

```bash
docker-compose ps
```

Todos devem estar com status "Up".

## 2. Criar um usuário

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }'
```

**Resposta esperada (201):**
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

**Copie o UUID retornado para usar nos próximos testes!**

## 3. Listar todos os usuários

```bash
curl http://localhost:8000/api/users
```

## 4. Buscar usuário por ID

```bash
curl http://localhost:8000/api/users/1
```

## 5. Aguardar processamento (5-10 segundos)

O Enrichment Service precisa processar a mensagem da fila.

Verificar logs:
```bash
docker logs teste-integracos-enrichment-service-1
```

## 6. Buscar dados enriquecidos

**Substitua {UUID} pelo UUID do usuário criado:**

```bash
curl http://localhost:3001/users/enriched/{UUID}
```

**Exemplo:**
```bash
curl http://localhost:3001/users/enriched/550e8400-e29b-41d4-a716-446655440000
```

**Resposta esperada (200):**
```json
{
  "linkedin": "linkedin.com/in/joaosilva",
  "github": "github.com/joaosilva"
}
```

## 7. Testar validações (deve retornar erro 400)

### Nome muito curto:
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jo",
    "email": "jo@example.com"
  }'
```

### Email inválido:
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "email-invalido"
  }'
```

## 8. Testar 404 (usuário não encontrado)

```bash
curl http://localhost:8000/api/users/999
```

```bash
curl http://localhost:3001/users/enriched/uuid-inexistente
```

## 9. Acessar o Frontend

Abra no navegador: http://localhost:5173

- Crie usuários pelo formulário
- Veja a lista de usuários
- Clique em um usuário para ver os detalhes enriquecidos

## 10. Acessar RabbitMQ Management

Abra no navegador: http://localhost:15672

- **Usuário**: guest
- **Senha**: guest

Veja a fila `user_created` e as mensagens sendo processadas.

## 11. Verificar logs dos serviços

```bash
# User Service
docker logs teste-integracos-user-service-1

# Enrichment Service
docker logs teste-integracos-enrichment-service-1

# Frontend
docker logs teste-integracos-frontend-1
```

## 12. Parar tudo

```bash
docker-compose down
```

## 13. Parar e limpar volumes

```bash
docker-compose down -v
```
