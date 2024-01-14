## Rodando apenas o mongo no Docker
docker-compose up --detach mongo  
docker-compose up --detach mongo-express

## Rodando buildando e rodando todos os servicos no Docker
docker-compose build --no-cache  
docker-compose up

## Endpoints
POST /documents  
GET  /documents  
GET  /documents/:uuid

