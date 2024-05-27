## Rodando apenas o mongo no Docker
docker-compose up --detach mongo  
docker-compose up --detach mongo-express

## Rodando buildando e rodando todos os servicos no Docker
docker-compose build --no-cache  
docker-compose up

## Rodando fora do container
node server.js

## Endpoints
~~~
#POST /documents/:to/:from
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/home/file.jpg" http://localhost:3000/documents/from/to
~~~

~~~
#GET /documents/:uuid
curl -X GET http://localhost:3000/documents/uuid
~~~

~~~
#GET /documents
curl -X GET http://localhost:3000/documents
~~~

