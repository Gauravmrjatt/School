# School Management System Backend

A production-grade, scalable backend system for school management built with **Node.js**, **TypeScript**, **GraphQL (Apollo Server v4)**, **PostgreSQL**, **Prisma ORM**, **Redis**, and **Kafka**.

## 🏗️ Architecture

This backend follows a **modular, event-driven architecture** with the following layers:

- **GraphQL API Layer** - Apollo Server v4 with queries, mutations, and subscriptions
- **Business Logic Layer** - Service modules for users, students, classes, attendance, exams, and fees
- **Data Access Layer** - Prisma ORM for type-safe database operations
- **Caching Layer** - Redis for performance optimization
- **Event Streaming Layer** - Kafka for async event processing
- **Pub/Sub Layer** - Redis Pub/Sub for real-time GraphQL subscriptions
- **Authentication & Authorization** - JWT with role-based access control (RBAC)

## 📋 Prerequisites

- **Node.js** >= 20.x
- **Docker** and **Docker Compose**
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd backend
cp .env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Zookeeper (port 2181)
- Kafka (port 9092)
- Backend application (port 4000)

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Access GraphQL Playground

Open your browser and navigate to:
```
http://localhost:4000/graphql
```

## 🗄️ Database Schema

The system manages the following entities:

- **Users** - Authentication and role management (Admin, Teacher, Student, Parent)
- **Students** - Student profiles with admission details
- **Teachers** - Teacher profiles with specialization
- **ClassSections** - Class and section management
- **Enrollments** - Student-class relationships
- **Attendance** - Daily attendance tracking
- **Exams** - Exam scheduling and management
- **ExamResults** - Student exam scores
- **FeeInvoices** - Fee billing and invoicing
- **Payments** - Payment transactions

## 🔐 Authentication & Authorization

### JWT Authentication

The system uses JWT tokens for authentication:
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry

### RBAC Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all operations |
| **Teacher** | Manage attendance, exams, marks, view students |
| **Student** | View own results, attendance, invoices |
| **Parent** | View child's results, attendance, pay fees |

## 📡 GraphQL API

### Example Queries

#### Login
```graphql
mutation {
  login(email: "admin@school.com", password: "password123") {
    accessToken
    refreshToken
    user {
      id
      name
      email
      role
    }
  }
}
```

#### Get Students (with pagination)
```graphql
query {
  students(page: 1, limit: 10) {
    data {
      id
      admissionNo
      user {
        name
        email
      }
    }
    pagination {
      total
      page
      totalPages
      hasNextPage
    }
  }
}
```

#### Record Attendance (bulk)
```graphql
mutation {
  recordAttendance(records: [
    {
      studentId: "student-id-1"
      classSectionId: "class-id-1"
      date: "2024-01-15"
      status: PRESENT
    },
    {
      studentId: "student-id-2"
      classSectionId: "class-id-1"
      date: "2024-01-15"
      status: ABSENT
    }
  ]) {
    id
    status
    student {
      user {
        name
      }
    }
  }
}
```

#### Enter Exam Marks (bulk)
```graphql
mutation {
  enterMarks(results: [
    {
      examId: "exam-id-1"
      studentId: "student-id-1"
      obtainedMarks: 85
    },
    {
      examId: "exam-id-1"
      studentId: "student-id-2"
      obtainedMarks: 92
    }
  ]) {
    id
    obtainedMarks
    student {
      user {
        name
      }
    }
  }
}
```

### Example Subscriptions

#### Real-time Attendance Updates
```graphql
subscription {
  attendanceRecorded(classSectionId: "class-id-1") {
    id
    status
    student {
      user {
        name
      }
    }
  }
}
```

#### Real-time Exam Results
```graphql
subscription {
  examResultPublished(studentId: "student-id-1") {
    id
    obtainedMarks
    exam {
      name
      subject
      maxMarks
    }
  }
}
```

## 🔄 Event Flow Example

### Attendance Recording Flow

1. **GraphQL Mutation** - Teacher records attendance via `recordAttendance` mutation
2. **Service Layer** - `AttendanceService` validates and saves to database
3. **Kafka Producer** - Publishes `attendance.recorded` event to Kafka topic
4. **Kafka Consumer** - Consumes event and processes it
5. **Redis Pub/Sub** - Consumer publishes to Redis channel `attendance:<classSectionId>`
6. **GraphQL Subscription** - Connected clients receive real-time update via WebSocket

## 🛠️ Development

### Run in Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Deploy migrations
npm run prisma:deploy

# Open Prisma Studio
npm run prisma:studio
```

### Setup Kafka Topics

```bash
npm run kafka:topics
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove volumes (clean slate)
docker-compose down -v
```

## 📊 Monitoring & Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

## 🧪 Testing

### Health Check

```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "kafka": "connected"
  }
}
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `KAFKA_BROKERS` | Kafka broker addresses | `localhost:9092` |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `10` |
| `LOG_LEVEL` | Logging level | `info` |

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

## 🚨 Troubleshooting

### Kafka Connection Issues

If Kafka fails to connect, ensure Zookeeper is running:
```bash
docker-compose logs zookeeper
docker-compose logs kafka
```

### Database Migration Errors

Reset the database:
```bash
docker-compose down -v
docker-compose up -d postgres
npm run prisma:migrate
```

### Redis Connection Issues

Check Redis status:
```bash
docker-compose exec redis redis-cli ping
```

## 📝 License

MIT

## 👥 Contributing

This is a production-grade school management system. Contributions are welcome!

---

**Built with ❤️ using Node.js, TypeScript, GraphQL, PostgreSQL, Prisma, Redis, and Kafka**
