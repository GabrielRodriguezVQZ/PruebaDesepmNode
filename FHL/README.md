# FHL Logistics - Delivery Orders API

REST API to manage clients, warehouses, products and delivery orders for the **FHL**
logistics company, built with **Express + TypeScript + PostgreSQL (Sequelize)**,
**JWT** authentication and interactive documentation with **Swagger**.

> Performance Test - Module 5.2 Node JS
> Coder: Gabriel Rodriguez

## Table of contents

- [Project structure](#project-structure)
- [Data model](#data-model)
- [Prerequisites](#prerequisites)
- [Step-by-step installation](#step-by-step-installation)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [API documentation (Swagger)](#api-documentation-swagger)
- [Recommended test flow](#recommended-test-flow)
- [Endpoints](#endpoints)
- [Business rules and validations](#business-rules-and-validations)
- [Roles and permissions](#roles-and-permissions)

---

## Project structure

```
fhl-logistics-api/
├── docker-compose.yml       # Spins up PostgreSQL locally
├── package.json
├── tsconfig.json
├── .env.example              # Example environment variables
└── src/
    ├── app.ts                 # Entry point: builds the app and mounts the modules
    ├── seed.ts                # Seeds the database (users, clients, warehouses, products)
    │
    ├── config/
    │   ├── db.ts               # Sequelize/PostgreSQL connection
    │   └── swagger.ts          # swagger-jsdoc config (reads *.router.ts)
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
    │   ├── productWarehouse.model.ts   # stock of a product per warehouse
    │   ├── order.model.ts
    │   ├── orderItem.model.ts
    │   └── associations.ts             # All relationships between models
    │
    └── modules/                # One module per domain (router / controller / service)
        ├── auth/
        ├── clients/
        ├── warehouses/
        ├── products/
        └── orders/
```

Each module follows 3 layers, each with a single responsibility:

- **`*.router.ts`** — defines the HTTP endpoint and its Swagger documentation.
- **`*.controller.ts`** — receives `req`/`res`, calls the service and translates errors into HTTP status codes.
- **`*.service.ts`** — the actual business logic and database queries (Sequelize).

---

## Data model

Relational database in PostgreSQL, with `UUID` primary keys.

| Entity                | Description                                                                 |
| ---------------------- | ---------------------------------------------------------------------------- |
| `users`                | System users (`administrador` or `analista`)                                |
| `clients`              | FHL clients (document ID, name, email)                                      |
| `addresses`            | Delivery addresses for each client                                          |
| `warehouses`           | Dispatch warehouses (active/inactive)                                       |
| `products`             | Available products (with logical delete)                                    |
| `product_warehouses`   | Stock of each product per warehouse                                         |
| `orders`               | Delivery orders (client + dispatch warehouse + status)                      |
| `order_items`          | Products requested within each order                                        |

**Key relationships:**

- A `client` has one or more `addresses`.
- A `product` can be in several `warehouses`, and has a different `stock` in each one (bridge table `product_warehouses`).
- An `order` belongs to a `client` and a `warehouse`, and has several `order_items` (each one with its `product` and `quantity`).

---

## Prerequisites

1. **[Node.js](https://nodejs.org/)** version 18 or higher.
   ```
   node --version
   npm --version
   ```
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (to run PostgreSQL without installing it manually).
   ```
   docker --version
   docker compose version
   ```
   > If you'd rather not use Docker, install PostgreSQL directly and adjust `DATABASE_URL` in your `.env`.
3. A client to test the API: Swagger UI (included in the project), Postman/Insomnia, or `curl`.

---

## Step-by-step installation

From the project root (`fhl-logistics-api/`):

```
# 1. Install all project dependencies
npm install

# 2. Create your .env file from the example
cp .env.example .env

# 3. Start PostgreSQL in a Docker container
docker compose up -d

# 4. Verify the container is running
docker ps
# You should see a container named "fhl_postgres" with status "Up"

# 5. Seed the database (users, clients, warehouses, products)
npm run seed
# This prints to the console the credentials and UUIDs you'll need to test the API

# 6. Start the server in development mode (with hot reload)
npm run dev
```

If everything went well, you'll see in the console:

```
PostgreSQL connected
server running at http://localhost:3000
```

The server will be available at **http://localhost:3000**, and the Swagger documentation
at **http://localhost:3000/api**.

---

## Environment variables

The `.env` file in the project root should look like this (see `.env.example`):

```
PORT=3000
JWT_SECRET=put_a_long_random_secret_here
DATABASE_URL=postgres://admin:admin123@localhost:5432/fhl_db
```

| Variable       | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------- |
| `PORT`         | Port where the Express server runs.                                                   |
| `JWT_SECRET`   | Private key used to sign and verify JWT tokens. Change it before using in production.  |
| `DATABASE_URL` | PostgreSQL connection string. If you use the included `docker-compose.yml`, don't change it. |

---

## Available scripts

| Command         | What it does                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Starts the server with hot reload (`tsx watch`). Use it while developing.                         |
| `npm run build` | Compiles the TypeScript project to `dist/`.                                                       |
| `npm start`     | Runs the compiled version (`dist/app.js`).                                                         |
| `npm run seed`  | Seeds users, clients, warehouses and products. Safe to run multiple times.                         |

---

## API documentation (Swagger)

With the server running, open in your browser:

```
http://localhost:3000/api
```

There you can see all the endpoints, their parameters, and try them directly with the
**"Try it out"** button.

To test protected routes (most of them are): log in first (`POST /auth/login`), copy the
returned `token`, and in the top-right corner of Swagger click **"Authorize"**, paste the
token (without the word `Bearer`, Swagger adds it automatically) and click **Authorize**.

---

## Recommended test flow

1. Run `npm run seed` and note down the credentials and UUIDs it prints.
2. Log in at `POST /auth/login` with `admin@fhl.com` / `Password123!` and copy the `token`.
3. Authenticate in Swagger with that token (the "Authorize" button).
4. Check `GET /warehouses/active` and `GET /products` to see the available stock.
5. Create an order at `POST /orders`, using the `id` of a client, a warehouse and one or
   more products with available stock in that warehouse.
6. Change the order's status with `PATCH /orders/:id/status`.
7. Check `GET /orders` (full history) or `GET /orders/client/:clientId` (client history).
8. Repeat the login with `analista@fhl.com` / `Password123!` to verify that this role can
   only view data and update order status (it cannot create clients, warehouses, products
   or new orders).

---

## Endpoints

### Auth (`/auth`)

| Method | Route             | Description                                    | Protected |
| ------ | ----------------- | ------------------------------------------------ | --------- |
| POST   | `/auth/register`  | Registers a user (administrador or analista)      | No        |
| POST   | `/auth/login`     | Logs in, returns a JWT                            | No        |

### Clients (`/clients`)

| Method | Route              | Description                                    | Protected                       |
| ------ | ------------------ | ------------------------------------------------- | --------------------------------- |
| POST   | `/clients`          | Creates a client and its delivery address         | Yes — `administrador` only        |
| GET    | `/clients`          | Lists all clients                                  | Yes — `administrador`/`analista`  |
| POST   | `/clients/search`   | Searches for a client by document ID (`documentId`)| Yes — `administrador`/`analista`  |
| PUT    | `/clients/:id`      | Updates a client                                   | Yes — `administrador` only        |
| DELETE | `/clients/:id`      | Deletes a client                                   | Yes — `administrador` only        |

### Warehouses (`/warehouses`)

| Method | Route                      | Description                                          | Protected                         |
| ------ | -------------------------- | ------------------------------------------------------ | ------------------------------------ |
| POST   | `/warehouses`               | Creates a warehouse                                    | Yes — `administrador` only           |
| GET    | `/warehouses`               | Lists all warehouses                                    | Yes — `administrador`/`analista`     |
| GET    | `/warehouses/active`        | Lists active warehouses including their stock            | Yes — `administrador`/`analista`     |
| PUT    | `/warehouses/:id`           | Updates a warehouse                                     | Yes — `administrador` only           |
| PATCH  | `/warehouses/:id/toggle`    | Activates/deactivates a warehouse, validating it exists   | Yes — `administrador` only           |

### Products (`/products`)

| Method | Route                      | Description                                                  | Protected                         |
| ------ | --------------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| POST   | `/products`                  | Creates a product                                                | Yes — `administrador` only           |
| GET    | `/products`                  | Lists active products                                            | Yes — `administrador`/`analista`     |
| GET    | `/products/:code`            | Returns the full information of a product by its code             | Yes — `administrador`/`analista`     |
| PUT    | `/products/:id`               | Updates a product                                                | Yes — `administrador` only           |
| DELETE | `/products/:id`               | Logically deletes a product                                      | Yes — `administrador` only           |
| POST   | `/products/:id/stock`         | Assigns/updates a product's stock in a warehouse                  | Yes — `administrador` only           |

### Orders (`/orders`)

| Method | Route                          | Description                                                  | Protected                          |
| ------ | ------------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| POST   | `/orders`                        | Creates an order (client + warehouse + products with stock)      | Yes — `administrador` only            |
| PATCH  | `/orders/:id/status`             | Changes the status of an existing order                          | Yes — `administrador`/`analista`      |
| GET    | `/orders`                        | Full history of all registered orders                            | Yes — `administrador`/`analista`      |
| GET    | `/orders/active`                 | Active orders (pendiente or en_transito)                         | Yes — `administrador`/`analista`      |
| GET    | `/orders/client/:clientId`       | History of orders for a specific client                          | Yes — `administrador`/`analista`      |

---

## Business rules and validations

- Two clients cannot be registered with the same document ID.
- An order cannot be created if there isn't enough stock of the product in the selected warehouse.
- An order cannot be created with a nonexistent client or a nonexistent/inactive warehouse.
- When changing an order's status, the value must be one of: `pendiente`, `en_transito`, `entregada`.
- Products are deleted logically (`active = false`), never physically removed.
- The entire order creation process (validations + stock deduction + item creation) runs
  inside a Sequelize transaction, to avoid inconsistencies.

## Roles and permissions

| Role             | Permissions                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `administrador`  | Full CRUD over clients, warehouses, products and orders                                             |
| `analista`       | Can only view (clients, warehouses, products, orders) and update the status of orders                |

All routes, except `/auth/register` and `/auth/login`, require a valid JWT token
(header `Authorization: Bearer <token>`) and are restricted according to the user's role.