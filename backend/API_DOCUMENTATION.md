# School Management System API

The School Management System API is organized around **GraphQL**. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### Login
To authenticate, you must first exchange your credentials for an access token.

**Mutation**
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
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

**Variables**
```json
{
  "email": "admin@school.com",
  "password": "password123"
}
```

### Authorization Header
Include the `accessToken` in the `Authorization` header for all protected requests:

```
Authorization: Bearer <your_access_token>
```

---

## Users

### Get Current User
Retrieve details about the currently authenticated user.

**Query**
```graphql
query Me {
  me {
    id
    name
    email
    role
    phone
  }
}
```

### Register User
Create a new user account. **Requires ADMIN role.**

**Mutation**
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

**Variables**
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

---

## Students

### Create Student
Create a new student profile linked to a user account. **Requires ADMIN role.**

**Mutation**
```graphql
mutation CreateStudent($input: CreateStudentInput!) {
  createStudent(input: $input) {
    id
    admissionNo
    user {
      name
      email
    }
  }
}
```

**Variables**
```json
{
  "input": {
    "userId": "user_id_here",
    "admissionNo": "STU2024001",
    "dob": "2010-05-15",
    "gender": "MALE",
    "address": "123 Main St"
  }
}
```

### List Students
Retrieve a paginated list of students.

**Query**
```graphql
query GetStudents($page: Int, $limit: Int) {
  students(page: $page, limit: $limit) {
    data {
      id
      admissionNo
      user {
        name
      }
    }
    pagination {
      total
      page
      totalPages
    }
  }
}
```

---

## Classes

### Create Class Section
Create a new class section for an academic year. **Requires ADMIN role.**

**Mutation**
```graphql
mutation CreateClass($input: CreateClassSectionInput!) {
  createClassSection(input: $input) {
    id
    className
    sectionName
    academicYear
  }
}
```

### Enroll Student
Enroll a student into a class section.

**Mutation**
```graphql
mutation EnrollStudent($studentId: ID!, $classSectionId: ID!) {
  enrollStudent(studentId: $studentId, classSectionId: $classSectionId) {
    id
    enrolledOn
    classSection {
      className
      sectionName
    }
  }
}
```

---

## Attendance

### Record Attendance
Record attendance for multiple students in a class. **Requires TEACHER or ADMIN role.**

**Mutation**
```graphql
mutation RecordAttendance($records: [AttendanceRecordInput!]!) {
  recordAttendance(records: $records) {
    id
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

**Variables**
```json
{
  "records": [
    {
      "studentId": "student_1",
      "classSectionId": "class_1",
      "date": "2024-01-15",
      "status": "PRESENT"
    },
    {
      "studentId": "student_2",
      "classSectionId": "class_1",
      "date": "2024-01-15",
      "status": "ABSENT",
      "remarks": "Sick leave"
    }
  ]
}
```

### Real-time Attendance Updates
Subscribe to real-time attendance events for a specific class.

**Subscription**
```graphql
subscription OnAttendanceRecorded($classSectionId: ID!) {
  attendanceRecorded(classSectionId: $classSectionId) {
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

---

## Exams

### Create Exam
Schedule a new exam.

**Mutation**
```graphql
mutation CreateExam($input: CreateExamInput!) {
  createExam(input: $input) {
    id
    name
    subject
    examDate
  }
}
```

### Enter Marks
Submit exam results for students.

**Mutation**
```graphql
mutation EnterMarks($results: [ExamResultInput!]!) {
  enterMarks(results: $results) {
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

---

## Fees

### Create Invoice
Generate a fee invoice for a student.

**Mutation**
```graphql
mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    amountDue
    dueDate
    description
  }
}
```

### Pay Invoice
Process a payment for an invoice.

**Mutation**
```graphql
mutation PayInvoice($invoiceId: ID!, $payment: PaymentInput!) {
  payInvoice(invoiceId: $invoiceId, payment: $payment) {
    id
    amount
    status
    paidAt
  }
}
```

---

## Errors

The API uses standard GraphQL error formats.

| Code | Description |
| :--- | :--- |
| `UNAUTHENTICATED` | You must be logged in to perform this action. |
| `FORBIDDEN` | You do not have permission to perform this action. |
| `BAD_USER_INPUT` | The input provided was invalid (e.g., invalid email). |
| `NOT_FOUND` | The requested resource could not be found. |
| `CONFLICT` | The resource already exists (e.g., duplicate email). |

**Example Error Response**
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
