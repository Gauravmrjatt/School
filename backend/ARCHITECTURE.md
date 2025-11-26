# School Management System - Architecture Documentation

## System Architecture Overview

The School Management System follows a **modern, event-driven microservices architecture** with the following key components:

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
└──────────────────┘ │ └────┬────┘ │ │ │ - users    │ │
                     │      │      │ │ └──────┬─────┘ │
                     └──────┼──────┘ │        │       │
                            │        │ ┌──────▼─────┐ │
                            │        │ │   Kafka    │ │
                            │        │ │  Consumer  │ │
                            │        │ └──────┬─────┘ │
                            │        │        │       │
                            └────────┼────────┘       │
                                     │                │
                                     └────────────────┘
```

---

## Component Details

### 1. API Gateway Layer

**Apollo Server v4**
- GraphQL endpoint: `http://localhost:4000/graphql`
- WebSocket endpoint: `ws://localhost:4000/graphql`
- Health check: `http://localhost:4000/health`

**Features:**
- Type-safe GraphQL schema
- Real-time subscriptions via WebSocket
- Request validation
- Error handling and formatting

### 2. Authentication & Authorization

**JWT Authentication**
- Access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Bcrypt password hashing (10 salt rounds)

**RBAC System**
```
┌──────────┐
│  ADMIN   │ ──► Full system access
└──────────┘

┌──────────┐
│ TEACHER  │ ──► Attendance, Exams, Marks, View Students
└──────────┘

┌──────────┐
│ STUDENT  │ ──► Own results, attendance, invoices
└──────────┘

┌──────────┐
│  PARENT  │ ──► Child's results, attendance, pay fees
└──────────┘
```

### 3. Business Logic Services

Each service implements:
- CRUD operations
- Business validation
- Redis caching
- Kafka event publishing
- Error handling

**Service Modules:**
- `UsersService` - User management
- `StudentsService` - Student profiles
- `ClassesService` - Class sections & enrollment
- `AttendanceService` - Attendance tracking
- `ExamsService` - Exam & results management
- `FeesService` - Invoicing & payments

### 4. Data Layer

**PostgreSQL Database**
- 10 normalized tables
- Foreign key constraints
- Indexes on frequently queried fields
- Cascade deletes for referential integrity

**Prisma ORM**
- Type-safe database queries
- Automatic migrations
- Query optimization
- Connection pooling

### 5. Caching Layer

**Redis Cache**
- TTL-based caching
- Pattern-based invalidation
- Cache-aside pattern

**Cached Data:**
- Student profiles (1 hour)
- Class sections (1 hour)
- Attendance summaries (30 min)
- Exam results (1 hour)

### 6. Event Streaming Layer

**Kafka Architecture**
```
┌─────────────────────────────────────────────────┐
│              KAFKA CLUSTER                      │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  Topic: attendance.recorded          │      │
│  │  Partitions: 3 | Replication: 1      │      │
│  └──────────────────────────────────────┘      │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  Topic: exam.results.published       │      │
│  │  Partitions: 3 | Replication: 1      │      │
│  └──────────────────────────────────────┘      │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  Topic: payment.completed            │      │
│  │  Partitions: 3 | Replication: 1      │      │
│  └──────────────────────────────────────┘      │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │  Topic: user.created                 │      │
│  │  Partitions: 3 | Replication: 1      │      │
│  └──────────────────────────────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Event-Driven Flow

### Example: Attendance Recording

```
┌──────────┐
│ Teacher  │
│  Client  │
└────┬─────┘
     │
     │ 1. GraphQL Mutation
     │    recordAttendance([...])
     ▼
┌────────────────┐
│ GraphQL        │
│ Resolver       │
└────┬───────────┘
     │
     │ 2. Call Service
     ▼
┌────────────────┐
│ Attendance     │
│ Service        │
└────┬───────────┘
     │
     ├──► 3. Save to DB (Prisma)
     │    ┌──────────────┐
     │    │ PostgreSQL   │
     │    └──────────────┘
     │
     └──► 4. Publish Event
          ┌──────────────┐
          │ Kafka        │
          │ Producer     │
          └──────┬───────┘
                 │
                 │ 5. Event: attendance.recorded
                 ▼
          ┌──────────────┐
          │ Kafka Topic  │
          └──────┬───────┘
                 │
                 │ 6. Consume Event
                 ▼
          ┌──────────────┐
          │ Kafka        │
          │ Consumer     │
          └──────┬───────┘
                 │
                 │ 7. Publish to Redis
                 ▼
          ┌──────────────┐
          │ Redis        │
          │ Pub/Sub      │
          └──────┬───────┘
                 │
                 │ 8. Real-time Update
                 ▼
          ┌──────────────┐
          │ GraphQL      │
          │ Subscription │
          └──────┬───────┘
                 │
                 │ 9. WebSocket Push
                 ▼
          ┌──────────────┐
          │ Connected    │
          │ Clients      │
          └──────────────┘
```

---

## Database Schema

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │◄─────┐
│ email       │      │
│ passwordHash│      │
│ role        │      │
│ name        │      │
│ phone       │      │
└─────────────┘      │
                     │
      ┌──────────────┼──────────────┐
      │              │              │
┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
│  Student  │  │  Teacher  │  │Attendance │
├───────────┤  ├───────────┤  │(recorder) │
│ id        │  │ id        │  └───────────┘
│ userId    │  │ userId    │
│ admissionNo│ │ hireDate  │
│ dob       │  │specialization│
│ gender    │  └───────────┘
│ address   │
└─────┬─────┘
      │
      ├──────────────┬──────────────┬──────────────┐
      │              │              │              │
┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐  ┌───▼───────┐
│Enrollment │  │Attendance │  │ExamResult │  │FeeInvoice │
├───────────┤  ├───────────┤  ├───────────┤  ├───────────┤
│ studentId │  │ studentId │  │ studentId │  │ studentId │
│classSectionId││classSectionId││ examId   │  │ amountDue │
│enrolledOn │  │ date      │  │obtainedMarks││ status   │
└───────────┘  │ status    │  └───────────┘  │ dueDate   │
               │ recordedBy│                 └─────┬─────┘
               └───────────┘                       │
                                             ┌─────▼─────┐
┌──────────────┐                             │  Payment  │
│ ClassSection │                             ├───────────┤
├──────────────┤                             │ invoiceId │
│ id           │◄────────────────────────────│ amount    │
│ className    │                             │ method    │
│ sectionName  │                             │ txRef     │
│ academicYear │                             │ paidAt    │
│ capacity     │                             └───────────┘
└──────┬───────┘
       │
       │
┌──────▼───────┐
│     Exam     │
├──────────────┤
│ id           │
│ name         │
│ subject      │
│ maxMarks     │
│ examDate     │
│classSectionId│
└──────────────┘
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js 20.x
- **Language:** TypeScript 5.3
- **API:** GraphQL (Apollo Server v4)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5.9
- **Cache:** Redis 7
- **Message Broker:** Apache Kafka 7.5
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Logging:** Winston

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Coordination:** Zookeeper (for Kafka)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │  Zookeeper   │  │
│  │  Container   │  │  Container   │  │  Container   │  │
│  │  Port: 5432  │  │  Port: 6379  │  │  Port: 2181  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │    Kafka     │  │      Backend Application         │ │
│  │  Container   │  │         Container                │ │
│  │  Port: 9092  │  │         Port: 4000               │ │
│  └──────────────┘  └──────────────────────────────────┘ │
│                                                          │
│                    Network: school_network               │
│                    Volumes: postgres_data, redis_data    │
└─────────────────────────────────────────────────────────┘
```

---

## Security Features

1. **Authentication**
   - JWT-based stateless authentication
   - Secure password hashing with bcrypt
   - Token expiration and refresh mechanism

2. **Authorization**
   - Role-based access control (RBAC)
   - Permission-based operations
   - Resource-level access control

3. **Data Protection**
   - SQL injection prevention (Prisma ORM)
   - GraphQL query complexity limiting
   - Input validation and sanitization

4. **Network Security**
   - Docker network isolation
   - Environment variable configuration
   - No hardcoded credentials

---

## Performance Optimizations

1. **Caching Strategy**
   - Redis cache for frequently accessed data
   - TTL-based cache invalidation
   - Cache-aside pattern

2. **Database Optimization**
   - Indexed columns for fast queries
   - Connection pooling
   - Efficient query design with Prisma

3. **Async Processing**
   - Kafka for event-driven operations
   - Non-blocking I/O
   - Background job processing

4. **API Optimization**
   - GraphQL field-level resolution
   - Pagination for large datasets
   - Batch operations (attendance, marks)

---

## Monitoring & Logging

**Logging Levels:**
- `error` - System errors and exceptions
- `warn` - Warning conditions
- `info` - Informational messages
- `debug` - Detailed debug information

**Log Files:**
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

**Health Monitoring:**
- Health check endpoint: `/health`
- Service status monitoring
- Connection health checks

---

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Load balancer ready
   - Session-less authentication

2. **Database Scaling**
   - Read replicas support
   - Connection pooling
   - Query optimization

3. **Cache Scaling**
   - Redis cluster support
   - Distributed caching
   - Cache sharding

4. **Event Streaming**
   - Kafka partitioning
   - Consumer groups
   - Event replay capability

---

## Future Enhancements

- [ ] Rate limiting
- [ ] API versioning
- [ ] Metrics collection (Prometheus)
- [ ] Distributed tracing (Jaeger)
- [ ] API documentation UI (GraphQL Playground)
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Multi-tenancy support
- [ ] Advanced analytics
