# base-api-express-generator

To run project local

```
npm run dev
```

To run migrations local

```
npm run migrate-dev
```

.env (example)

```
ENV=default
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://user:password@127.0.0.1:27017/
MONGO_DB=default
```

.env.development (example)

```
ENV=development
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://user:password@127.0.0.1:27017/
MONGO_DB=base-api-express-generator
```


Para solucionar lo de Mongo que no esta definida url:
Instalar la ultima version de migrate-mongo: 
```
npm install migrate-mongo@latest
```

Crear las keys:
```
mkdir keys
cd keys
openssl genpkey -algorithm RSA -out private_key.pem
openssl rsa -pubout -in private_key.pem -out public_key.pem
```
