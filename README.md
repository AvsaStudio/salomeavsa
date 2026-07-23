# Salomé Avsa Miller — Portfolio

Full-Stack Engineer · ML/AI Developer

A responsive portfolio showcasing full-stack engineering, machine learning and AI integration, API development, and an AI-powered coffee-ordering chatbot.

- Portfolio: [salomeavsa.com](https://salomeavsa.com)
- GitHub: [AvsaStudio](https://github.com/AvsaStudio)

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express, REST-style API |
| Tooling | Git, GitHub, npm, TSX |
| ML/AI | OpenAI Responses API, conversational AI, prompt engineering, stateful interactions |

## Featured Project: Brewed Beans AI Chatbot

Brewed Beans is a conversational coffee-ordering experience presented inside a custom espresso-machine interface. Customers can browse the menu, choose drink sizes, add customizations, review an order, and interact with an AI barista.

Key features include:

- Dynamic conversational responses with multi-turn history
- Menu and size selection with live price calculation
- Add-on tracking and checkout summary
- Suggested response chips based on conversation state
- Loading, error, payment, restart, and empty-order states
- Server-side OpenAI integration that keeps the API key out of the browser

## Current Application Architecture

The project uses a PERN architecture for persistent orders and a server-side OpenAI integration for conversation. When `DATABASE_URL` is configured, pending orders are restored after refresh; without it, the interface continues in local-order mode.

```mermaid
flowchart LR
    U[User] --> UI[React and TypeScript UI]
    UI -->|Chat and order requests| API[Express API]
    API -->|Responses request| AI[OpenAI API]
    AI -->|Assistant response| API
    API -->|JSON response| UI
    UI --> STATE[Local React state]
    API <-->|Parameterized SQL| DB[(PostgreSQL)]

    subgraph Browser
        UI
        STATE
    end

    subgraph Node.js Server
        API
    end
```

### Chat Request Lifecycle

```mermaid
sequenceDiagram
    actor Customer
    participant React as React CoffeeChatbot
    participant Express as Express /api/chat
    participant OpenAI as OpenAI Responses API

    Customer->>React: Sends a message
    React->>React: Add user message and show loading state
    React->>Express: POST message and recent history
    Express->>Express: Validate and limit request data
    Express->>OpenAI: Send system instructions and conversation
    OpenAI-->>Express: Return BrewBot response
    Express-->>React: Return JSON message
    React->>React: Update history and suggested actions
    React-->>Customer: Render response and scroll into view
```

## CRUD Fundamentals

CRUD describes the four core operations used to manage application data.

| Operation | HTTP method | SQL operation | Coffee-order example |
| --- | --- | --- | --- |
| Create | `POST` | `INSERT` | Create an order or add an item |
| Read | `GET` | `SELECT` | Retrieve an order and its items |
| Update | `PATCH` / `PUT` | `UPDATE` | Change a size, add-on, or status |
| Delete | `DELETE` | `DELETE` | Remove an item or cancel an order |

The chatbot uses these CRUD operations through validated Express endpoints. React keeps an optimistic local representation while PostgreSQL remains the persistent source of truth for saved orders and totals.

## PERN Persistence Architecture

PERN stands for PostgreSQL, Express, React, and Node.js.

```mermaid
flowchart TB
    CUSTOMER[Customer]

    subgraph Client[React Client]
        COMPONENTS[UI Components]
        STORE[Order and Chat State]
        SERVICE[API Service]
        COMPONENTS <--> STORE
        STORE <--> SERVICE
    end

    subgraph Server[Node.js and Express Server]
        MIDDLEWARE[Logging, JSON, Auth and Validation]
        ROUTES[REST Routes]
        CONTROLLERS[Controllers]
        ORDER_SERVICE[Order Service]
        AI_SERVICE[AI Chat Service]
        REPOSITORIES[Repositories]
        ROUTES --> MIDDLEWARE
        MIDDLEWARE --> CONTROLLERS
        CONTROLLERS --> ORDER_SERVICE
        CONTROLLERS --> AI_SERVICE
        ORDER_SERVICE --> REPOSITORIES
    end

    subgraph Data[Data and External Services]
        POSTGRES[(PostgreSQL)]
        OPENAI[OpenAI API]
    end

    CUSTOMER <--> COMPONENTS
    SERVICE <-->|HTTPS and JSON| ROUTES
    REPOSITORIES <-->|Parameterized SQL| POSTGRES
    AI_SERVICE <-->|Responses API| OPENAI
```

### REST API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/:id` | Read an order with its items |
| `PATCH` | `/api/orders/:id` | Update status or customer details |
| `DELETE` | `/api/orders/:id` | Cancel an order |
| `POST` | `/api/orders/:id/items` | Add an item to an order |
| `PATCH` | `/api/orders/:orderId/items/:itemId` | Update an order item |
| `DELETE` | `/api/orders/:orderId/items/:itemId` | Remove an order item |
| `GET` | `/api/menu` | Read current products, prices, sizes, and add-ons |
| `POST` | `/api/chat` | Generate an AI barista response |

Creating an order returns a random public UUID and a separate access token. All subsequent order requests must send that token in the `X-Order-Token` header, so knowing or guessing an order identifier is not enough to access it.

### Backend Layers

```text
server/
├── index.ts                 # Starts HTTP server and handles shutdown
├── app.ts                   # Builds the Express middleware pipeline
├── middleware/              # Logging, authentication, validation, errors
├── routes/                  # Maps HTTP methods and paths
├── controllers/             # Converts HTTP requests into service calls
├── services/                # Business rules and transactions
├── repositories/            # Parameterized PostgreSQL queries
├── schemas/                 # Zod request contracts
├── db/                      # Pool, migration runner, SQL migrations
└── tests/                   # PostgreSQL CRUD integration tests
```

The request path is `route → middleware → controller → service → repository → PostgreSQL`. Chat uses the same route/controller/service pattern and calls OpenAI from the server.

## PostgreSQL Schema

```mermaid
erDiagram
    ORDERS ||--|{ ORDER_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : references
    ORDER_ITEMS ||--o{ ORDER_ITEM_ADD_ONS : includes
    ADD_ONS ||--o{ ORDER_ITEM_ADD_ONS : references

    ORDERS {
        int id PK
        uuid public_id UK
        uuid access_token UK
        varchar status
        decimal total
        timestamptz created_at
        timestamptz updated_at
    }

    MENU_ITEMS {
        int id PK
        varchar name UK
        decimal base_price
        boolean available
    }

    ORDER_ITEMS {
        int id PK
        int order_id FK
        int menu_item_id FK
        varchar size
        decimal unit_price
        int quantity
    }

    ADD_ONS {
        int id PK
        varchar name UK
        decimal price
        boolean available
    }

    ORDER_ITEM_ADD_ONS {
        int order_item_id PK, FK
        int add_on_id PK, FK
        decimal price_at_purchase
    }
```

### Schema Design Decisions

- `ORDERS` stores the order lifecycle and computed total.
- Public order UUIDs and separate access tokens prevent sequential database IDs from granting access.
- `ORDER_ITEMS` separates individual drinks from the parent order.
- `MENU_ITEMS` centralizes product names, prices, and availability.
- `ADD_ONS` prevents customization data from being duplicated across orders.
- `ORDER_ITEM_ADD_ONS` resolves the many-to-many relationship between order items and add-ons.
- `unit_price` and `price_at_purchase` preserve historical pricing even if the menu changes later.
- Foreign keys protect referential integrity, and cascading deletion can remove dependent items when an order is deleted.

## Separation of Responsibilities

```mermaid
flowchart LR
    REACT[React] -->|Presentation and user interaction| EXPRESS[Express]
    EXPRESS -->|Validation, authorization, business rules| DATABASE[(PostgreSQL)]
    EXPRESS -->|Prompt and conversation context| MODEL[OpenAI]
    DATABASE -->|Source of truth for orders and prices| EXPRESS
    MODEL -->|Natural-language assistance| EXPRESS
```

The AI should interpret natural language and produce a helpful conversation. Application code and PostgreSQL should remain the source of truth for menu availability, prices, totals, orders, and payment state.

## Interview Deep Dive

An accurate way to describe this project is:

> The application uses React on the frontend with an Express and Node.js backend. React controls the interactive ordering experience and keeps an optimistic copy of the active order. Express validates requests, applies business rules, calculates prices, and executes parameterized PostgreSQL queries through transactional CRUD services. The server also communicates with OpenAI, preventing both the API key and database credentials from reaching the browser.

Important engineering considerations for the PERN version include:

- Parameterized SQL queries to reduce SQL-injection risk
- Server-side request validation and consistent error responses
- Database transactions when creating an order with multiple items
- Authentication and authorization for protected order access
- Appropriate HTTP status codes such as `201`, `400`, `404`, and `500`
- Indexes on foreign keys and frequently queried fields
- Connection pooling for efficient PostgreSQL access
- Automated API, database, and UI tests
- Structured AI output instead of deriving application actions from prose

## Local Development

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Add a valid server-side key to `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/brewed_beans
TEST_DATABASE_URL=postgresql://username:password@localhost:5432/brewed_beans_test
DATABASE_SSL=false
```

Create the `brewed_beans` database before running the migration. Set `DATABASE_SSL=true` when using a hosted PostgreSQL provider that requires TLS. The OpenAI key and database credentials must remain server-side and must never use a `VITE_` prefix.

## Validation

```bash
npm run typecheck
npm run build
npm test
```

The integration suite uses only `TEST_DATABASE_URL`, clears its order data, and skips safely when a dedicated test database is not configured.

## Current Focus

- Full-stack application development
- API integration and server-side security
- Scalable component architecture
- PostgreSQL data modeling and persistent CRUD workflows
- Accessible, responsive user experiences
