# School Management System Backend

A production-grade, scalable backend system for school management built with **Node.js**, **TypeScript**, **GraphQL (Apollo Server v4)**, **PostgreSQL**, **Prisma ORM**, **Redis**, and **Kafka**.

---

## 🏗️ Architecture

The School Management System follows a **modern, event-driven microservices architecture**.

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile App  │  │   Admin      │              │
│  │  (React)     │  │  (React      │  │   Dashboard  │              │
│  │              │  │   Native)    │  │              │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                       │
│         └─────────────────┴──────────────────┘                       │
│                           │                                          │
│                    HTTP/WebSocket                                    │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────────┐
│                    API GATEWAY LAYER                                 │
│                           │                                          │
│                  ┌────────▼────────┐                                 │
│                  │  Apollo Server  │                                 │
│                  │   (GraphQL)     │                                 │
│                  │   Port: 4000    │                                 │
│                  └────────┬────────┘                                 │
│                           │                                          │
│         ┌─────────────────┼─────────────────┐                        │
│         │                 │                 │                        │
│    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐                   │
│    │  Auth   │      │ GraphQL │      │  WebSocket│                  │
│    │Middleware│      │Resolvers│      │Subscriptions│                │
│    │  (JWT)  │      │         │      │           │                  │
│    └────┬────┘      └────┬────┘      └────┬────┘                   │
│         │                 │                 │                        │
└─────────┼─────────────────┼─────────────────┼────────────────────────┘
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼────────────────────────┐
│         │      BUSINESS LOGIC LAYER         │                        │
│         │                 │                 │                        │
│    ┌────▼────┐       ┌────▼────┐      ┌────▼────┐                   │
│    │  Users  │       │Students │      │ Classes │                   │
│    │ Service │       │ Service │      │ Service │                   │
│    └────┬────┘       └────┬────┘      └────┬────┘                   │
│         │                 │                 │                        │
│    ┌────▼────┐       ┌────▼────┐      ┌────▼────┐                   │
│    │Attendance│      │  Exams  │      │  Fees   │                   │
│    │ Service │       │ Service │      │ Service │                   │
│    └────┬────┘       └────┬────┘      └────┬────┘                   │
│         │                 │                 │                        │
│         └─────────────────┼─────────────────┘                        │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
┌─────────▼────────┐ ┌──────▼──────┐ ┌───────▼────────┐
│  DATA LAYER      │ │ CACHE LAYER │ │  EVENT LAYER   │
│                  │ │             │ │                │
│  ┌───────────┐   │ │ ┌─────────┐ │ │ ┌────────────┐ │
│  │ Prisma ORM│   │ │ │  Redis  │ │ │ │   Kafka    │ │
│  └─────┬─────┘   │ │ │  Cache  │ │ │ │  Producer  │ │
│        │         │ │ │Port:6379│ │ │ └──────┬─────┘ │
│  ┌─────▼─────┐   │ │ └─────────┘ │ │        │       │
│  │PostgreSQL │   │ │             │ │ ┌──────▼─────┐ │
│  │  Database │   │ │ ┌─────────┐ │ │ │   Topics   │ │
│  │Port: 5432 │   │ │ │  Redis  │ │ │ │ - attendance│
│  └───────────┘   │ │ │ Pub/Sub │ │ │ │ - exams    │ │
│                  │ │ │         │ │ │ │ - payments │ │
│                  │ │ │         │ │ │ │ - users    │ │
│                  │ │ └────┬────┘ │ │ └──────┬─────┘ │
│                  │      │      │ │ └──────┬─────┘ │
│                  └──────┼──────┘ │        │       │
│                         │        │ ┌──────▼─────┐ │
│                         │        │ │   Kafka    │ │
│                         │        │ │  Consumer  │ │
│                         │        │ └──────┬─────┘ │
│                         │        │        │       │
│                         └────────┼────────┘       │
│                                  │                │
│                                  └────────────────┘
```

### Key Components

1.  **API Gateway Layer (Apollo Server v4)**
    *   **GraphQL Endpoint**: `http://localhost:4000/graphql`
    *   **WebSocket Endpoint**: `ws://localhost:4000/graphql`
    *   **Features**: Type-safe schema, real-time subscriptions, request validation.

2.  **Authentication & Authorization**
    *   **JWT**: Access tokens (15m) and Refresh tokens (7d).
    *   **RBAC**: Roles for Admin, Teacher, Student, and Parent.

3.  **Business Logic Services**
    *   Modular services for Users, Students, Classes, Attendance, Exams, and Fees.
    *   Implements caching, event publishing, and business validation.

4.  **Data Layer**
    *   **PostgreSQL**: Normalized relational database.
    *   **Prisma ORM**: Type-safe database access and migrations.

5.  **Caching Layer (Redis)**
    *   TTL-based caching for high-read data (Profiles, Class Sections).
    *   Cache-aside pattern.

6.  **Event Streaming Layer (Kafka)**
    *   Async processing for attendance, exam results, and payments.
    *   Decouples services and enables real-time features.

---

## 🛠️ Technology Stack

*   **Runtime**: Node.js 20.x
*   **Language**: TypeScript 5.3
*   **API**: GraphQL (Apollo Server v4)
*   **Database**: PostgreSQL 16
*   **ORM**: Prisma 5.9
*   **Cache**: Redis 7
*   **Message Broker**: Apache Kafka 7.5
*   **Infrastructure**: Docker & Docker Compose

---

## 🚀 Quick Start Guide

### Prerequisites

*   ✅ Docker Desktop installed and running
*   ✅ Node.js 20.x or higher
*   ✅ npm or yarn
*   ✅ Ports 4000, 5432, 6379, 9092 available

### Installation Steps

1.  **Navigate to Backend Directory**
    ```bash
    cd backend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    ```bash
    cp .env.example .env
    ```

4.  **Start Services with Docker Compose**
    ```bash
    docker-compose up -d
    ```
    *   Starts PostgreSQL, Redis, Zookeeper, Kafka, and the Backend App.

5.  **Run Database Migrations**
    ```bash
    npm run prisma:migrate
    ```

6.  **Generate Prisma Client**
    ```bash
    npm run prisma:generate
    ```

7.  **Start Development Server**
    ```bash
    npm run dev
    ```
    *   Server ready at `http://localhost:4000/graphql`

### Testing the API

You can use the **GraphQL Playground** at `http://localhost:4000/graphql` to interact with the API.

**Health Check:**
```bash
curl http://localhost:4000/health
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── graphql/         # GraphQL schema and resolvers
│   ├── kafka/           # Kafka producer/consumer
│   ├── middlewares/     # Authentication & authorization
│   ├── modules/         # Business logic services
│   ├── redis/           # Redis cache & pub/sub
│   ├── utils/           # Utility functions
│   └── server.ts        # Main entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── logs/                # Application logs
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Dependencies
```

---

## 🚨 Troubleshooting

### Common Issues

*   **Port Conflicts**: Ensure ports 4000, 5432, 6379, and 9092 are free.
    ```bash
    lsof -i :4000
    kill -9 <PID>
    ```
*   **Kafka Connection Failed**: Restart Zookeeper and Kafka.
    ```bash
    docker-compose restart zookeeper kafka
    ```
*   **Database Migration Errors**: Reset the database volume.
    ```bash
    docker-compose down -v
    docker-compose up -d postgres
    npm run prisma:migrate
    ```

---

## 📝 License

MIT

---

**Built with ❤️ using Node.js, TypeScript, GraphQL, PostgreSQL, Prisma, Redis, and Kafka**
