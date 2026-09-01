# FHL Logistica - API de Ordenes de Entrega

API REST para gestionar clientes, bodegas, productos y ordenes de entrega de la empresa de
logistica **FHL**, construida con **Express + TypeScript + PostgreSQL (Sequelize)**,
autenticacion **JWT** y documentacion interactiva con **Swagger**.

> Coder: Gabriel Rodriguez

## Tabla de contenido

- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo de datos](#modelo-de-datos)
- [Requisitos previos](#requisitos-previos)
- [Instalacion paso a paso](#instalacion-paso-a-paso)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Documentacion de la API (Swagger)](#documentacion-de-la-api-swagger)
- [Flujo de prueba recomendado](#flujo-de-prueba-recomendado)
- [Endpoints](#endpoints)
- [Reglas de negocio y validaciones](#reglas-de-negocio-y-validaciones)
- [Roles y permisos](#roles-y-permisos)

---

## Estructura del proyecto

```
fhl-logistics-api/
├── docker-compose.yml       # Levanta PostgreSQL en local
├── package.json
├── tsconfig.json
├── .env.example              # Ejemplo de variables de entorno
└── src/
    ├── app.ts                 # Punto de entrada: arma la app y monta los modulos
    ├── seed.ts                # Llena la base de datos (usuarios, clientes, bodegas, productos)
    │
    ├── config/
    │   ├── db.ts               # Conexion Sequelize/PostgreSQL
    │   └── swagger.ts          # Config de swagger-jsdoc (lee *.router.ts)
    │
    ├── middleware/
    │   └── auth.middleware.ts  # requireAuth, requireRole
    │
    ├── utils/
    │   └── jwt.ts               # generateToken, verifyToken
    │
    ├── models/
    │   ├── user.model.ts
    │   ├── client.model.ts
    │   ├── address.model.ts
    │   ├── warehouse.model.ts
    │   ├── product.model.ts
    │   ├── productWarehouse.model.ts   # stock de un producto por bodega
    │   ├── order.model.ts
    │   ├── orderItem.model.ts
    │   └── associations.ts             # Todas las relaciones entre modelos
    │
    └── modules/                # Un modulo por dominio (router / controller / service)
        ├── auth/
        ├── clients/
        ├── warehouses/
        ├── products/
        └── orders/
```

Cada modulo sigue 3 capas con una sola responsabilidad cada una:

- **`*.router.ts`** — define el endpoint HTTP y su documentacion Swagger.
- **`*.controller.ts`** — recibe `req`/`res`, llama al service y traduce errores a codigos HTTP.
- **`*.service.ts`** — logica de negocio real y consultas a la base de datos (Sequelize).

---

## Modelo de datos

Base de datos relacional en PostgreSQL, con llaves primarias `UUID`.

| Entidad             | Descripcion                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| `users`              | Usuarios del sistema (`administrador` o `analista`)                         |
| `clients`             | Clientes de FHL (cedula, nombre, correo)                                    |
| `addresses`           | Direcciones de entrega de cada cliente                                     |
| `warehouses`          | Bodegas de despacho (activas/inactivas)                                    |
| `products`            | Productos disponibles (con borrado logico)                                 |
| `product_warehouses`  | Stock de cada producto por bodega                                          |
| `orders`              | Ordenes de entrega (cliente + bodega de despacho + estado)                 |
| `order_items`         | Productos solicitados dentro de cada orden                                 |

**Relaciones clave:**

- Un `client` tiene una o varias `addresses`.
- Un `product` puede estar en varias `warehouses`, y en cada una tiene un `stock` distinto (tabla puente `product_warehouses`).
- Una `order` pertenece a un `client` y a una `warehouse`, y tiene varios `order_items` (cada uno con su `product` y `quantity`).

---

## Requisitos previos

1. **[Node.js](https://nodejs.org/)** version 18 o superior.
   ```
   node --version
   npm --version
   ```
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (para levantar PostgreSQL sin instalarlo manualmente).
   ```
   docker --version
   docker compose version
   ```
   > Si prefieres no usar Docker, instala PostgreSQL directamente y ajusta `DATABASE_URL` en tu `.env`.
3. Un cliente para probar la API: Swagger UI (incluido en el proyecto), Postman/Insomnia, o `curl`.

---

## Instalacion paso a paso

Desde la raiz del proyecto (`fhl-logistics-api/`):

```
# 1. Instalar todas las dependencias del proyecto
npm install

# 2. Crear tu archivo .env a partir del ejemplo
cp .env.example .env

# 3. Levantar PostgreSQL en un contenedor Docker
docker compose up -d

# 4. Verificar que el contenedor este corriendo
docker ps
# Deberias ver un contenedor llamado "fhl_postgres" en estado "Up"

# 5. Sembrar la base de datos (usuarios, clientes, bodegas, productos)
npm run seed
# Esto imprime en consola las credenciales y los UUIDs que vas a necesitar para probar la API

# 6. Iniciar el servidor en modo desarrollo (con recarga automatica)
npm run dev
```

Si todo salio bien, veras en consola:

```
PostgreSQL Conectado
server running en http://localhost:3000
```

El servidor queda disponible en **http://localhost:3000**, y la documentacion Swagger en
**http://localhost:3000/api**.

---

## Variables de entorno

El archivo `.env` en la raiz del proyecto debe verse asi (ver `.env.example`):

```
PORT=3000
JWT_SECRET=coloca_un_secreto_largo_y_aleatorio_aqui
DATABASE_URL=postgres://admin:admin123@localhost:5432/fhl_db
```

| Variable       | Descripcion                                                                          |
| -------------- | -------------------------------------------------------------------------------------- |
| `PORT`         | Puerto donde corre el servidor Express.                                               |
| `JWT_SECRET`   | Clave privada usada para firmar y verificar los tokens JWT. Cambiala en produccion.    |
| `DATABASE_URL` | Cadena de conexion a PostgreSQL. Si usas el `docker-compose.yml` incluido, no la cambies. |

---

## Scripts disponibles

| Comando         | Que hace                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `npm run dev`   | Inicia el servidor con recarga automatica (`tsx watch`). Usalo mientras desarrollas.           |
| `npm run build` | Compila el proyecto TypeScript a `dist/`.                                                     |
| `npm start`     | Ejecuta la version compilada (`dist/app.js`).                                                 |
| `npm run seed`  | Puebla usuarios, clientes, bodegas y productos. Es seguro correrlo varias veces.               |

---

## Documentacion de la API (Swagger)

Con el servidor corriendo, abre en el navegador:

```
http://localhost:3000/api
```

Ahi puedes ver todos los endpoints, sus parametros, y probarlos directamente con el boton
**"Try it out"**.

Para probar rutas protegidas (la mayoria lo son): haz login primero (`POST /auth/login`),
copia el `token` que devuelve, y en la esquina superior derecha de Swagger haz clic en
**"Authorize"**, pega el token (sin la palabra `Bearer`, Swagger la agrega sola) y dale
**Authorize**.

---

## Flujo de prueba recomendado

1. Corre `npm run seed` y anota las credenciales y UUIDs que imprime.
2. Haz login en `POST /auth/login` con `admin@fhl.com` / `Password123!` y copia el `token`.
3. Autentica en Swagger con ese token (boton "Authorize").
4. Consulta `GET /warehouses/active` y `GET /products` para ver el stock disponible.
5. Crea una orden en `POST /orders`, usando el `id` de un cliente, una bodega y uno o mas
   productos con stock disponible en esa bodega.
6. Cambia el estado de la orden con `PATCH /orders/:id/status`.
7. Consulta `GET /orders` (historial completo) o `GET /orders/client/:clientId` (historial por cliente).
8. Repite el login con `analista@fhl.com` / `Password123!` para verificar que este rol solo
   puede consultar y actualizar el estado de las ordenes (no puede crear clientes, bodegas,
   productos ni ordenes nuevas).

---

## Endpoints

### Auth (`/auth`)

| Metodo | Ruta             | Descripcion                                   | Protegida |
| ------ | ---------------- | ---------------------------------------------- | --------- |
| POST   | `/auth/register` | Registra un usuario (administrador o analista) | No        |
| POST   | `/auth/login`    | Inicia sesion, devuelve un JWT                 | No        |

### Clients (`/clients`)

| Metodo | Ruta              | Descripcion                                  | Protegida                     |
| ------ | ----------------- | ---------------------------------------------- | ------------------------------ |
| POST   | `/clients`         | Crea un cliente y su direccion de entrega     | Si — solo `administrador`      |
| GET    | `/clients`         | Lista todos los clientes                      | Si — `administrador`/`analista` |
| POST   | `/clients/search`  | Busca un cliente por cedula (`documentId`)    | Si — `administrador`/`analista` |
| PUT    | `/clients/:id`     | Actualiza un cliente                          | Si — solo `administrador`      |
| DELETE | `/clients/:id`     | Elimina un cliente                            | Si — solo `administrador`      |

### Warehouses (`/warehouses`)

| Metodo | Ruta                      | Descripcion                                          | Protegida                     |
| ------ | ------------------------- | ------------------------------------------------------ | ------------------------------ |
| POST   | `/warehouses`              | Crea una bodega                                       | Si — solo `administrador`      |
| GET    | `/warehouses`              | Lista todas las bodegas                               | Si — `administrador`/`analista` |
| GET    | `/warehouses/active`       | Lista las bodegas activas incluyendo su stock          | Si — `administrador`/`analista` |
| PUT    | `/warehouses/:id`          | Actualiza una bodega                                  | Si — solo `administrador`      |
| PATCH  | `/warehouses/:id/toggle`   | Activa/inactiva una bodega, validando que exista        | Si — solo `administrador`      |

### Products (`/products`)

| Metodo | Ruta                     | Descripcion                                              | Protegida                     |
| ------ | ------------------------ | ----------------------------------------------------------- | ------------------------------ |
| POST   | `/products`               | Crea un producto                                            | Si — solo `administrador`      |
| GET    | `/products`               | Lista los productos activos                                 | Si — `administrador`/`analista` |
| GET    | `/products/:code`         | Retorna la informacion completa de un producto por su codigo | Si — `administrador`/`analista` |
| PUT    | `/products/:id`           | Actualiza un producto                                       | Si — solo `administrador`      |
| DELETE | `/products/:id`           | Elimina un producto de forma logica                          | Si — solo `administrador`      |
| POST   | `/products/:id/stock`     | Asigna/actualiza el stock de un producto en una bodega        | Si — solo `administrador`      |

### Orders (`/orders`)

| Metodo | Ruta                          | Descripcion                                              | Protegida                      |
| ------ | ----------------------------- | ------------------------------------------------------------ | -------------------------------- |
| POST   | `/orders`                      | Crea una orden (cliente + bodega + productos con stock)     | Si — solo `administrador`        |
| PATCH  | `/orders/:id/status`           | Cambia el estado de una orden existente                     | Si — `administrador`/`analista`  |
| GET    | `/orders`                      | Historial completo de todas las ordenes                     | Si — `administrador`/`analista`  |
| GET    | `/orders/active`               | Ordenes activas (pendiente o en_transito)                   | Si — `administrador`/`analista`  |
| GET    | `/orders/client/:clientId`     | Historial de ordenes de un cliente especifico                | Si — `administrador`/`analista`  |

---

## Reglas de negocio y validaciones

- No se pueden registrar dos clientes con el mismo numero de documento (cedula).
- No se puede crear una orden si no hay stock suficiente del producto en la bodega seleccionada.
- No se puede crear una orden con un cliente inexistente o una bodega inexistente/inactiva.
- Al cambiar el estado de una orden, el valor debe ser uno de: `pendiente`, `en_transito`, `entregada`.
- Los productos se eliminan de forma logica (`active = false`), nunca se borran fisicamente.
- Toda la creacion de una orden (validaciones + descuento de stock + creacion de items) se
  ejecuta dentro de una transaccion de Sequelize, para evitar inconsistencias.

## Roles y permisos

| Rol             | Permisos                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `administrador`  | CRUD completo de clientes, bodegas, productos y ordenes                                          |
| `analista`       | Solo puede consultar (clientes, bodegas, productos, ordenes) y actualizar el estado de las ordenes |

Todas las rutas, salvo `/auth/register` y `/auth/login`, requieren un token JWT valido
(header `Authorization: Bearer <token>`) y estan restringidas segun el rol del usuario.
