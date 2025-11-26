# School Management System - API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Users API](#users-api)
- [Students API](#students-api)
- [Teachers API](#teachers-api)
- [Classes API](#classes-api)
- [Attendance API](#attendance-api)
- [Exams API](#exams-api)
- [Fees API](#fees-api)
- [Subscriptions](#subscriptions)
- [Error Codes](#error-codes)

---

## Authentication

### Login
Authenticate a user and receive JWT tokens.

**Endpoint:** `POST /graphql`

**Query:**
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
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

**Variables:**
```json
{
  "email": "admin@school.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "user-123",
        "name": "Admin User",
        "email": "admin@school.com",
        "role": "ADMIN"
      }
    }
  }
}
```

**Authorization Header:**
For all subsequent requests, include:
```
Authorization: Bearer <accessToken>
```

### Register User
Create a new user account (Admin only).

**Query:**
```graphql
mutation RegisterUser($input: RegisterUserInput!) {
  registerUser(input: $input) {
    id
    name
    email
    role
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "John Doe",
    "email": "john.doe@school.com",
    "password": "SecurePassword123!",
    "role": "TEACHER",
    "phone": "+1234567890"
  }
}
```

**Permissions:** `ADMIN` only

---

## Users API

### Get Current User

**Query:**
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

**Permissions:** Authenticated users

### Get All Users

**Query:**
```graphql
query GetUsers {
  users {
    id
    name
    email
    role
    phone
    createdAt
  }
}
```

**Permissions:** `ADMIN` only

---

## Students API

### Create Student

**Query:**
```graphql
mutation CreateStudent($input: CreateStudentInput!) {
  createStudent(input: $input) {
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

**Variables:**
```json
{
  "input": {
    "userId": "user-123",
    "admissionNo": "STU2024001",
    "dob": "2010-05-15",
    "gender": "MALE",
    "address": "123 Main Street, City, State"
  }
}
```

**Permissions:** `ADMIN` only

### Get Students (Paginated)

**Query:**
```graphql
query GetStudents($page: Int, $limit: Int) {
  students(page: $page, limit: $limit) {
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

**Variables:**
```json
{
  "page": 1,
  "limit": 20
}
```

**Permissions:** `ADMIN`, `TEACHER`

### Get Single Student

**Query:**
```graphql
query GetStudent($id: ID!) {
  student(id: $id) {
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
  }
}
```

**Permissions:** `ADMIN`, `TEACHER`, or own student data

---

## Classes API

### Create Class Section

**Query:**
```graphql
mutation CreateClass($input: CreateClassSectionInput!) {
  createClassSection(input: $input) {
    id
    className
    sectionName
    academicYear
    capacity
  }
}
```

**Variables:**
```json
{
  "input": {
    "className": "Grade 10",
    "sectionName": "A",
    "academicYear": "2024-2025",
    "capacity": 40
  }
}
```

**Permissions:** `ADMIN` only

### Get Class Sections

**Query:**
```graphql
query GetClassSections($academicYear: String) {
  classSections(academicYear: $academicYear) {
    id
    className
    sectionName
    academicYear
    capacity
    enrollments {
      student {
        admissionNo
        user {
          name
        }
      }
    }
  }
}
```

**Permissions:** `ADMIN`, `TEACHER`, `STUDENT`

### Enroll Student

**Query:**
```graphql
mutation EnrollStudent($studentId: ID!, $classSectionId: ID!) {
  enrollStudent(studentId: $studentId, classSectionId: $classSectionId) {
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

**Permissions:** `ADMIN` only

---

## Attendance API

### Record Attendance (Bulk)

**Query:**
```graphql
mutation RecordAttendance($records: [AttendanceRecordInput!]!) {
  recordAttendance(records: $records) {
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
  }
}
```

**Variables:**
```json
{
  "records": [
    {
      "studentId": "student-1",
      "classSectionId": "class-1",
      "date": "2024-01-15",
      "status": "PRESENT"
    },
    {
      "studentId": "student-2",
      "classSectionId": "class-1",
      "date": "2024-01-15",
      "status": "ABSENT",
      "remarks": "Sick leave"
    }
  ]
}
```

**Permissions:** `ADMIN`, `TEACHER`

**Event:** Publishes `attendance.recorded` to Kafka → Real-time subscription update

### Get Student Attendance

**Query:**
```graphql
query GetStudentAttendance($studentId: ID!, $startDate: String, $endDate: String) {
  attendanceForStudent(
    studentId: $studentId
    startDate: $startDate
    endDate: $endDate
  ) {
    id
    date
    status
    remarks
    classSection {
      className
      sectionName
    }
  }
}
```

**Permissions:** `ADMIN`, `TEACHER`, or own student data

---

## Exams API

### Create Exam

**Query:**
```graphql
mutation CreateExam($input: CreateExamInput!) {
  createExam(input: $input) {
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

**Variables:**
```json
{
  "input": {
    "name": "Mid-term Mathematics Exam",
    "subject": "Mathematics",
    "maxMarks": 100,
    "examDate": "2024-02-15",
    "classSectionId": "class-123"
  }
}
```

**Permissions:** `ADMIN`, `TEACHER`

### Enter Marks (Bulk)

**Query:**
```graphql
mutation EnterMarks($results: [ExamResultInput!]!) {
  enterMarks(results: $results) {
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

**Variables:**
```json
{
  "results": [
    {
      "examId": "exam-123",
      "studentId": "student-1",
      "obtainedMarks": 85,
      "remarks": "Excellent"
    },
    {
      "examId": "exam-123",
      "studentId": "student-2",
      "obtainedMarks": 92
    }
  ]
}
```

**Permissions:** `ADMIN`, `TEACHER`

**Event:** Publishes `exam.results.published` to Kafka → Real-time subscription update

### Get Exam Results

**Query:**
```graphql
query GetExamResults($studentId: ID, $examId: ID) {
  examResults(studentId: $studentId, examId: $examId) {
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

**Permissions:** `ADMIN`, `TEACHER`, or own student results

---

## Fees API

### Create Invoice

**Query:**
```graphql
mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
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

**Variables:**
```json
{
  "input": {
    "studentId": "student-123",
    "amountDue": 5000.00,
    "dueDate": "2024-03-31",
    "description": "Tuition Fee - Q1 2024"
  }
}
```

**Permissions:** `ADMIN` only

### Pay Invoice

**Query:**
```graphql
mutation PayInvoice($invoiceId: ID!, $payment: PaymentInput!) {
  payInvoice(invoiceId: $invoiceId, payment: $payment) {
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

**Variables:**
```json
{
  "invoiceId": "invoice-123",
  "payment": {
    "amount": 5000.00,
    "method": "BANK_TRANSFER",
    "txRef": "TXN123456789"
  }
}
```

**Permissions:** `ADMIN`, `PARENT`

**Event:** Publishes `payment.completed` to Kafka

### Get Invoices

**Query:**
```graphql
query GetInvoices($studentId: ID, $status: InvoiceStatus) {
  invoices(studentId: $studentId, status: $status) {
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

**Permissions:** `ADMIN`, or own student invoices

---

## Subscriptions

### Attendance Updates

**Subscription:**
```graphql
subscription OnAttendanceRecorded($classSectionId: ID!) {
  attendanceRecorded(classSectionId: $classSectionId) {
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

**WebSocket URL:** `ws://localhost:4000/graphql`

**Connection Params:**
```json
{
  "authorization": "Bearer <accessToken>"
}
```

### Exam Results Updates

**Subscription:**
```graphql
subscription OnExamResultPublished($studentId: ID!) {
  examResultPublished(studentId: $studentId) {
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

---

## Error Codes

### Authentication Errors

**Code:** `UNAUTHENTICATED`
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

### Authorization Errors

**Code:** `FORBIDDEN`
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

### Validation Errors

**Code:** `BAD_USER_INPUT`
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

### Not Found Errors

**Code:** `NOT_FOUND`
```json
{
  "errors": [
    {
      "message": "Student with ID student-123 not found",
      "extensions": {
        "code": "NOT_FOUND",
        "resource": "Student",
        "id": "student-123"
      }
    }
  ]
}
```

### Conflict Errors

**Code:** `CONFLICT`
```json
{
  "errors": [
    {
      "message": "User with this email already exists",
      "extensions": {
        "code": "CONFLICT"
      }
    }
  ]
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination

All paginated endpoints support:
- `page` (default: 1)
- `limit` (default: 10, max: 100)

Response includes:
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Caching

Redis caching is implemented for:
- Student profiles (TTL: 1 hour)
- Class sections (TTL: 1 hour)
- Attendance summaries (TTL: 30 minutes)
- Exam results (TTL: 1 hour)

Cache is automatically invalidated on updates.
