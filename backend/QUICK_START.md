# Quick Start Guide - School Management System

## Prerequisites Checklist

- ✅ Docker Desktop installed and running
- ✅ Node.js 20.x or higher installed
- ✅ npm or yarn package manager
- ✅ At least 4GB RAM available
- ✅ Ports 4000, 5432, 6379, 9092 available

## Installation Steps

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 330 packages in 40s
found 0 vulnerabilities
```

### 3. Start Docker Services

```bash
docker-compose up -d
```

**Services Started:**
- ✅ PostgreSQL (port 5432)
- ✅ Redis (port 6379)
- ✅ Zookeeper (port 2181)
- ✅ Kafka (port 9092)
- ✅ Backend Application (port 4000)

**Verify Services:**
```bash
docker-compose ps
```

All services should show status as "Up" or "healthy".

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

This creates all database tables and relationships.

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the type-safe Prisma client.

### 6. (Optional) Setup Kafka Topics

```bash
npm run kafka:topics
```

Creates the required Kafka topics for event streaming.

### 7. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
🚀 Server ready at http://localhost:4000/graphql
🔌 Subscriptions ready at ws://localhost:4000/graphql
```

---

## Testing the API

### Option 1: GraphQL Playground

1. Open browser: `http://localhost:4000/graphql`
2. You'll see the GraphQL Playground interface

### Option 2: Health Check

```bash
curl http://localhost:4000/health
```

**Expected Response:**
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

---

## First API Call - Create Admin User

### Step 1: Register Admin User

**GraphQL Mutation:**
```graphql
mutation {
  registerUser(input: {
    name: "Admin User"
    email: "admin@school.com"
    password: "Admin@123"
    role: ADMIN
  }) {
    id
    name
    email
    role
  }
}
```

**Note:** First user must be created without authentication. After this, all operations require authentication.

### Step 2: Login

```graphql
mutation {
  login(email: "admin@school.com", password: "Admin@123") {
    accessToken
    refreshToken
    user {
      id
      name
      role
    }
  }
}
```

**Copy the `accessToken` from the response.**

### Step 3: Set Authorization Header

In GraphQL Playground, add HTTP header:
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
}
```

### Step 4: Test Authenticated Query

```graphql
query {
  me {
    id
    name
    email
    role
  }
}
```

---

## Common Operations

### Create a Teacher

```graphql
mutation {
  registerUser(input: {
    name: "John Teacher"
    email: "john.teacher@school.com"
    password: "Teacher@123"
    role: TEACHER
  }) {
    id
  }
}

mutation {
  createTeacher(input: {
    userId: "USER_ID_FROM_ABOVE"
    hireDate: "2024-01-01"
    specialization: "Mathematics"
  }) {
    id
    specialization
  }
}
```

### Create a Student

```graphql
mutation {
  registerUser(input: {
    name: "Jane Student"
    email: "jane.student@school.com"
    password: "Student@123"
    role: STUDENT
  }) {
    id
  }
}

mutation {
  createStudent(input: {
    userId: "USER_ID_FROM_ABOVE"
    admissionNo: "STU2024001"
    dob: "2010-05-15"
    gender: FEMALE
    address: "123 Main St"
  }) {
    id
    admissionNo
  }
}
```

### Create a Class

```graphql
mutation {
  createClassSection(input: {
    className: "Grade 10"
    sectionName: "A"
    academicYear: "2024-2025"
    capacity: 40
  }) {
    id
    className
    sectionName
  }
}
```

### Enroll Student

```graphql
mutation {
  enrollStudent(
    studentId: "STUDENT_ID"
    classSectionId: "CLASS_ID"
  ) {
    id
    enrolledOn
  }
}
```

---

## Testing Real-Time Subscriptions

### Terminal 1: Start Subscription

```graphql
subscription {
  attendanceRecorded(classSectionId: "CLASS_ID") {
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

### Terminal 2: Record Attendance

```graphql
mutation {
  recordAttendance(records: [{
    studentId: "STUDENT_ID"
    classSectionId: "CLASS_ID"
    date: "2024-01-15"
    status: PRESENT
  }]) {
    id
    status
  }
}
```

**Result:** Terminal 1 will receive real-time update!

---

## Useful Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f kafka
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart
```

### Clean Restart (removes data)

```bash
docker-compose down -v
docker-compose up -d
npm run prisma:migrate
```

### Open Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

---

## Troubleshooting

### Port Already in Use

**Error:** `Port 4000 is already allocated`

**Solution:**
```bash
# Find process using port
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### Kafka Connection Failed

**Solution:**
```bash
# Restart Kafka and Zookeeper
docker-compose restart zookeeper kafka

# Wait 30 seconds, then restart backend
docker-compose restart backend
```

### Database Migration Error

**Solution:**
```bash
# Reset database
docker-compose down -v
docker-compose up -d postgres
npm run prisma:migrate
```

### Redis Connection Error

**Solution:**
```bash
# Check Redis
docker-compose exec redis redis-cli ping

# Should return: PONG

# If not, restart Redis
docker-compose restart redis
```

---

## Development Workflow

1. **Make code changes** in `src/` directory
2. **Server auto-restarts** (using ts-node-dev)
3. **Test in GraphQL Playground**
4. **Check logs** for errors
5. **Commit changes** to git

---

## Production Deployment

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Run Production Build

```bash
npm start
```

### Environment Variables

Update `.env` for production:
- Change JWT secrets
- Update database credentials
- Configure Redis/Kafka hosts
- Set `NODE_ENV=production`

---

## Next Steps

1. ✅ Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
2. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture
3. ✅ Read [EXAMPLES.md](./EXAMPLES.md) for more API examples
4. ✅ Explore GraphQL schema in Playground
5. ✅ Test all CRUD operations
6. ✅ Test real-time subscriptions
7. ✅ Review event flow with Kafka

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify services: `docker-compose ps`
3. Check health: `curl http://localhost:4000/health`
4. Review documentation files

---

**🎉 You're all set! Happy coding!**
