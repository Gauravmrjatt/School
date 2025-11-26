# GraphQL API Examples

Complete examples for using the School Management System GraphQL API.

## Authentication

### Register a New User

```graphql
mutation RegisterUser {
  registerUser(input: {
    name: "John Doe"
    email: "john.doe@school.com"
    password: "SecurePassword123!"
    role: ADMIN
    phone: "+1234567890"
  }) {
    id
    name
    email
    role
    createdAt
  }
}
```

### Login

```graphql
mutation Login {
  login(
    email: "john.doe@school.com"
    password: "SecurePassword123!"
  ) {
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

**Note**: Include the access token in subsequent requests:
```
Authorization: Bearer <accessToken>
```

### Get Current User

```graphql
query Me {
  me {
    id
    name
    email
    role
    phone
    student {
      id
      admissionNo
    }
    teacher {
      id
      specialization
    }
  }
}
```

## Student Management

### Create a Student

```graphql
mutation CreateStudent {
  createStudent(input: {
    userId: "user-id-here"
    admissionNo: "STU2024001"
    dob: "2010-05-15"
    gender: MALE
    address: "123 Main Street, City, State"
  }) {
    id
    admissionNo
    dob
    gender
    address
    user {
      name
      email
    }
  }
}
```

### Get All Students (Paginated)

```graphql
query GetStudents {
  students(page: 1, limit: 20) {
    data {
      id
      admissionNo
      user {
        name
        email
      }
      enrollments {
        classSection {
          className
          sectionName
        }
      }
    }
    pagination {
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get Single Student

```graphql
query GetStudent {
  student(id: "student-id-here") {
    id
    admissionNo
    dob
    gender
    address
    user {
      name
      email
      phone
    }
    enrollments {
      classSection {
        className
        sectionName
        academicYear
      }
    }
  }
}
```

## Class Management

### Create Class Section

```graphql
mutation CreateClass {
  createClassSection(input: {
    className: "Grade 10"
    sectionName: "A"
    academicYear: "2024-2025"
    capacity: 40
  }) {
    id
    className
    sectionName
    academicYear
    capacity
  }
}
```

### Get All Class Sections

```graphql
query GetClassSections {
  classSections(academicYear: "2024-2025") {
    id
    className
    sectionName
    academicYear
    capacity
    enrollments {
      student {
        user {
          name
        }
      }
    }
  }
}
```

### Enroll Student in Class

```graphql
mutation EnrollStudent {
  enrollStudent(
    studentId: "student-id-here"
    classSectionId: "class-id-here"
  ) {
    id
    enrolledOn
    student {
      admissionNo
      user {
        name
      }
    }
    classSection {
      className
      sectionName
    }
  }
}
```

## Attendance Management

### Record Attendance (Bulk)

```graphql
mutation RecordAttendance {
  recordAttendance(records: [
    {
      studentId: "student-id-1"
      classSectionId: "class-id-1"
      date: "2024-01-15"
      status: PRESENT
      remarks: null
    },
    {
      studentId: "student-id-2"
      classSectionId: "class-id-1"
      date: "2024-01-15"
      status: ABSENT
      remarks: "Sick leave"
    },
    {
      studentId: "student-id-3"
      classSectionId: "class-id-1"
      date: "2024-01-15"
      status: LATE
      remarks: "Arrived 10 minutes late"
    }
  ]) {
    id
    date
    status
    remarks
    student {
      admissionNo
      user {
        name
      }
    }
    recorder {
      name
    }
  }
}
```

### Get Attendance for Student

```graphql
query GetStudentAttendance {
  attendanceForStudent(
    studentId: "student-id-here"
    startDate: "2024-01-01"
    endDate: "2024-01-31"
  ) {
    id
    date
    status
    remarks
    classSection {
      className
      sectionName
    }
    recorder {
      name
    }
  }
}
```

### Get Attendance for Class on Specific Date

```graphql
query GetClassAttendance {
  attendanceForClass(
    classSectionId: "class-id-here"
    date: "2024-01-15"
  ) {
    id
    status
    remarks
    student {
      admissionNo
      user {
        name
      }
    }
  }
}
```

## Exam Management

### Create Exam

```graphql
mutation CreateExam {
  createExam(input: {
    name: "Mid-term Mathematics Exam"
    subject: "Mathematics"
    maxMarks: 100
    examDate: "2024-02-15"
    classSectionId: "class-id-here"
  }) {
    id
    name
    subject
    maxMarks
    examDate
    classSection {
      className
      sectionName
    }
  }
}
```

### Get All Exams

```graphql
query GetExams {
  exams(classSectionId: "class-id-here") {
    id
    name
    subject
    maxMarks
    examDate
    classSection {
      className
      sectionName
    }
  }
}
```

### Enter Marks (Bulk)

```graphql
mutation EnterMarks {
  enterMarks(results: [
    {
      examId: "exam-id-here"
      studentId: "student-id-1"
      obtainedMarks: 85
      remarks: "Excellent performance"
    },
    {
      examId: "exam-id-here"
      studentId: "student-id-2"
      obtainedMarks: 92
      remarks: "Outstanding"
    },
    {
      examId: "exam-id-here"
      studentId: "student-id-3"
      obtainedMarks: 78
      remarks: "Good effort"
    }
  ]) {
    id
    obtainedMarks
    remarks
    student {
      admissionNo
      user {
        name
      }
    }
    exam {
      name
      subject
      maxMarks
    }
  }
}
```

### Get Exam Results for Student

```graphql
query GetStudentResults {
  examResults(studentId: "student-id-here") {
    id
    obtainedMarks
    remarks
    exam {
      name
      subject
      maxMarks
      examDate
    }
  }
}
```

## Fee Management

### Create Invoice

```graphql
mutation CreateInvoice {
  createInvoice(input: {
    studentId: "student-id-here"
    amountDue: 5000.00
    dueDate: "2024-03-31"
    description: "Tuition Fee - Q1 2024"
  }) {
    id
    amountDue
    status
    dueDate
    description
    student {
      admissionNo
      user {
        name
      }
    }
  }
}
```

### Get Invoices

```graphql
query GetInvoices {
  invoices(studentId: "student-id-here", status: PENDING) {
    id
    amountDue
    status
    dueDate
    description
    payments {
      id
      amount
      method
      paidAt
    }
  }
}
```

### Pay Invoice

```graphql
mutation PayInvoice {
  payInvoice(
    invoiceId: "invoice-id-here"
    payment: {
      amount: 5000.00
      method: BANK_TRANSFER
      txRef: "TXN123456789"
    }
  ) {
    id
    amount
    method
    txRef
    paidAt
    invoice {
      id
      status
      amountDue
    }
  }
}
```

## Subscriptions

### Subscribe to Attendance Updates

```graphql
subscription OnAttendanceRecorded {
  attendanceRecorded(classSectionId: "class-id-here") {
    id
    date
    status
    student {
      admissionNo
      user {
        name
      }
    }
  }
}
```

### Subscribe to Exam Results

```graphql
subscription OnExamResultPublished {
  examResultPublished(studentId: "student-id-here") {
    id
    obtainedMarks
    remarks
    exam {
      name
      subject
      maxMarks
    }
  }
}
```

## Complete Flow Example: Recording Attendance

This example demonstrates the complete event-driven flow from mutation to subscription.

### Step 1: Teacher Opens Subscription (WebSocket)

```graphql
subscription {
  attendanceRecorded(classSectionId: "class-123") {
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

### Step 2: Teacher Records Attendance

```graphql
mutation {
  recordAttendance(records: [
    {
      studentId: "student-456"
      classSectionId: "class-123"
      date: "2024-01-15"
      status: PRESENT
    }
  ]) {
    id
    status
  }
}
```

### Step 3: Event Flow

1. **Mutation Resolver** → Saves to database via Prisma
2. **Kafka Producer** → Publishes event to `attendance.recorded` topic
3. **Kafka Consumer** → Receives event from topic
4. **Redis Pub/Sub** → Consumer publishes to `attendance:class-123` channel
5. **GraphQL Subscription** → WebSocket sends update to all subscribed clients

### Step 4: Subscription Receives Update

```json
{
  "data": {
    "attendanceRecorded": {
      "id": "att-789",
      "status": "PRESENT",
      "student": {
        "user": {
          "name": "John Smith"
        }
      }
    }
  }
}
```

## Error Handling

### Authentication Error

```json
{
  "errors": [
    {
      "message": "You must be logged in to perform this action",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Authorization Error

```json
{
  "errors": [
    {
      "message": "You do not have permission to perform this action",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Validation Error

```json
{
  "errors": [
    {
      "message": "Invalid email format",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "field": "email"
      }
    }
  ]
}
```

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"admin@school.com\", password: \"password123\") { accessToken user { name } } }"
  }'
```

### Query with Authentication

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-access-token>" \
  -d '{
    "query": "query { students(page: 1, limit: 10) { data { id user { name } } } }"
  }'
```

## WebSocket Connection (Subscriptions)

Use a GraphQL client that supports subscriptions (e.g., Apollo Client, GraphQL Playground):

```javascript
const ws = new WebSocket('ws://localhost:4000/graphql', 'graphql-ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'connection_init',
    payload: {
      authorization: 'Bearer <your-access-token>'
    }
  }));
};
```
