import { gql } from '@apollo/client';

// Authentication Mutations
export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

// Student Mutations
export const CREATE_STUDENT_MUTATION = gql`
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
`;

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent($id: ID!, $input: CreateStudentInput!) {
    updateStudent(id: $id, input: $input) {
      id
      admissionNo
      dob
      gender
      address
    }
  }
`;

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;

// Teacher Mutations
export const CREATE_TEACHER_MUTATION = gql`
  mutation CreateTeacher($input: CreateTeacherInput!) {
    createTeacher(input: $input) {
      id
      hireDate
      specialization
      user {
        name
        email
      }
    }
  }
`;

export const UPDATE_TEACHER_MUTATION = gql`
  mutation UpdateTeacher($id: ID!, $input: CreateTeacherInput!) {
    updateTeacher(id: $id, input: $input) {
      id
      hireDate
      specialization
    }
  }
`;

export const DELETE_TEACHER_MUTATION = gql`
  mutation DeleteTeacher($id: ID!) {
    deleteTeacher(id: $id)
  }
`;

// Class Section Mutations
export const CREATE_CLASS_SECTION_MUTATION = gql`
  mutation CreateClassSection($input: CreateClassSectionInput!) {
    createClassSection(input: $input) {
      id
      className
      sectionName
      academicYear
      capacity
    }
  }
`;

export const UPDATE_CLASS_SECTION_MUTATION = gql`
  mutation UpdateClassSection($id: ID!, $input: CreateClassSectionInput!) {
    updateClassSection(id: $id, input: $input) {
      id
      className
      sectionName
      academicYear
      capacity
    }
  }
`;

export const DELETE_CLASS_SECTION_MUTATION = gql`
  mutation DeleteClassSection($id: ID!) {
    deleteClassSection(id: $id)
  }
`;

export const ENROLL_STUDENT_MUTATION = gql`
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
`;

// Attendance Mutations
export const RECORD_ATTENDANCE_MUTATION = gql`
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
`;

// Exam Mutations
export const CREATE_EXAM_MUTATION = gql`
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
`;

export const UPDATE_EXAM_MUTATION = gql`
  mutation UpdateExam($id: ID!, $input: CreateExamInput!) {
    updateExam(id: $id, input: $input) {
      id
      name
      subject
      maxMarks
      examDate
    }
  }
`;

export const DELETE_EXAM_MUTATION = gql`
  mutation DeleteExam($id: ID!) {
    deleteExam(id: $id)
  }
`;

export const ENTER_MARKS_MUTATION = gql`
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
`;

// Fee Mutations
export const CREATE_INVOICE_MUTATION = gql`
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
`;

export const UPDATE_INVOICE_MUTATION = gql`
  mutation UpdateInvoice($id: ID!, $status: InvoiceStatus!) {
    updateInvoice(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DELETE_INVOICE_MUTATION = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;

export const PAY_INVOICE_MUTATION = gql`
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
`;
