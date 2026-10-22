# School Management System

A school management backend in TypeScript, plus a Next.js front end. Covers students, teachers, classes, attendance, exams, fee invoices and payments.

The backend has its own architecture notes in [`backend/README.md`](backend/README.md).

## What it does

- Apollo Server v4 GraphQL API with WebSocket subscriptions
- Ten Prisma models: `User`, `Student`, `Teacher`, `ClassSection`, `Enrollment`, `Attendance`, `Exam`, `ExamResult`, `FeeInvoice`, `Payment`
- Kafka carries four event types: `attendance.recorded`, `exam.results.published`, `payment.completed`, `user.created`
- Redis pub/sub fans results out to subscribers, channel per class or per student
- JWT access and refresh tokens, bcrypt hashing, role based access
- Docker and Docker Compose for local services

About 6,600 lines across 59 files.

## Layout

```
backend/    TypeScript, Apollo GraphQL, Prisma, Redis, Kafka
frontend/   Next.js, Apollo Client, react-hook-form, Framer Motion
```

## Run the backend

```bash
cd backend
npm install
cp .env.example .env          # fill it in
npm run prisma:generate
npm run prisma:migrate
npm run kafka:topics          # creates the four topics
npm run dev                   # Apollo Server on :4000
```

### Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis |
| `KAFKA_BROKERS`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID` | Kafka |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Token signing |
| `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY` | Token lifetimes |
| `BCRYPT_SALT_ROUNDS` | Hashing cost |
| `PORT`, `NODE_ENV`, `LOG_LEVEL` | Server config |

`backend/.env.example` has the full list.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server via `ts-node-dev` |
| `npm run build` | Compile TypeScript and copy the GraphQL schema |
| `npm start` | Run the compiled server |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Create and apply a dev migration |
| `npm run prisma:deploy` | Apply migrations in production |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run kafka:topics` | Create Kafka topics |

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- `backend/API_DOCUMENTATION.md` documents the GraphQL schema.
- `frontend/.next/` build output is committed (99 files). Run `git rm -r --cached frontend/.next` and gitignore it to keep the tree readable.
