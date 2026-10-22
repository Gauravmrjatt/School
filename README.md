# School Management System

A full-stack school management platform: a TypeScript GraphQL backend with an event-driven service layer, plus a Next.js frontend.

The backend has detailed architecture documentation in [`backend/README.md`](backend/README.md).

## Highlights

- **Apollo Server v4** GraphQL API with **WebSocket subscriptions**
- **PostgreSQL + Prisma ORM** — 11 models covering students, teachers, classes, attendance, exams, fees and payments
- **Redis** for caching and shared state
- **Kafka** event backbone, with a topic bootstrap script
- **JWT access + refresh tokens**, bcrypt password hashing
- **Role-based access control** (`UserRole`)
- **Docker + Docker Compose** for local services

## Repository layout

```
backend/    TypeScript · Apollo GraphQL · Prisma · Redis · Kafka
frontend/   Next.js · Apollo Client · react-hook-form · Framer Motion
```

## Data model

`User` · `Student` · `Teacher` · `ClassSection` · `Enrollment` · `Attendance` · `Exam` · `ExamResult` · `FeeInvoice` · `Payment`

Enums: `UserRole`, `AttendanceStatus`, `InvoiceStatus`, `Gender`, `PaymentMethod`

## Running the backend

```bash
cd backend
npm install
cp .env.example .env          # fill in the values
npm run prisma:generate
npm run prisma:migrate
npm run kafka:topics          # create the Kafka topics
npm run dev                   # Apollo Server on :4000
```

### Backend environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis connection |
| `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka connection |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Token signing |
| `JWT_ACCESS_EXPIRY` / `JWT_REFRESH_EXPIRY` | Token lifetimes |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost |
| `PORT` / `NODE_ENV` / `LOG_LEVEL` | Server config |

See `backend/.env.example` for the full list.

### Backend scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with `ts-node-dev` |
| `npm run build` | Compile TypeScript, copy the GraphQL schema |
| `npm start` | Run the compiled server |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Create and apply a dev migration |
| `npm run prisma:deploy` | Apply migrations in production |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run kafka:topics` | Bootstrap Kafka topics |

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- `backend/API_DOCUMENTATION.md` documents the GraphQL schema in detail.
- Build output (`frontend/.next/`) is committed to the repository. Run `git rm -r --cached frontend/.next` and add it to `.gitignore` to keep the tree clean.
