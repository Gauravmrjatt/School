import { gql } from '@apollo/client';

// Authentication Queries
export const LOGIN_MUTATION = gql`
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
`;

export const ME_QUERY = gql`
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
`;

// Students Queries
export const GET_STUDENTS = gql`
  query GetStudents($page: Int, $limit: Int) {
    students(page: $page, limit: $limit) {
      data {
        id
        admissionNo
        dob
        gender
        address
        user {
          id
          name
          email
          phone
        }
        enrollments {
          id
          classSection {
            id
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
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      admissionNo
      dob
      gender
      address
      user {
        id
        name
        email
        phone
      }
      enrollments {
        id
        enrolledOn
        classSection {
          id
          className
          sectionName
          academicYear
        }
      }
      attendances {
        id
        date
        status
        remarks
      }
      examResults {
        id
        obtainedMarks
        remarks
        exam {
          id
          name
          subject
          maxMarks
          examDate
        }
      }
      feeInvoices {
        id
        amountDue
        status
        dueDate
        description
      }
    }
  }
`;

// Teachers Queries
export const GET_TEACHERS = gql`
  query GetTeachers {
    teachers {
      id
      hireDate
      specialization
      user {
        id
        name
        email
        phone
      }
    }
  }
`;

// Classes Queries
export const GET_CLASS_SECTIONS = gql`
  query GetClassSections($academicYear: String) {
    classSections(academicYear: $academicYear) {
      id
      className
      sectionName
      academicYear
      capacity
      enrollments {
        id
        student {
          id
          admissionNo
          user {
            name
          }
        }
      }
    }
  }
`;

export const GET_CLASS_SECTION = gql`
  query GetClassSection($id: ID!) {
    classSection(id: $id) {
      id
      className
      sectionName
      academicYear
      capacity
      enrollments {
        id
        enrolledOn
        student {
          id
          admissionNo
          user {
            id
            name
            email
          }
        }
      }
    }
  }
`;

// Attendance Queries
export const GET_ATTENDANCE_FOR_STUDENT = gql`
  query GetAttendanceForStudent($studentId: ID!, $startDate: String, $endDate: String) {
    attendanceForStudent(studentId: $studentId, startDate: $startDate, endDate: $endDate) {
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
`;

export const GET_ATTENDANCE_FOR_CLASS = gql`
  query GetAttendanceForClass($classSectionId: ID!, $date: String!) {
    attendanceForClass(classSectionId: $classSectionId, date: $date) {
      id
      date
      status
      remarks
      student {
        id
        admissionNo
        user {
          name
        }
      }
    }
  }
`;

// Exams Queries
export const GET_EXAMS = gql`
  query GetExams($classSectionId: ID) {
    exams(classSectionId: $classSectionId) {
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

export const GET_EXAM_RESULTS = gql`
  query GetExamResults($studentId: ID, $examId: ID) {
    examResults(studentId: $studentId, examId: $examId) {
      id
      obtainedMarks
      remarks
      exam {
        id
        name
        subject
        maxMarks
        examDate
      }
      student {
        id
        admissionNo
        user {
          name
        }
      }
    }
  }
`;

// Fees Queries
export const GET_INVOICES = gql`
  query GetInvoices($studentId: ID, $status: InvoiceStatus) {
    invoices(studentId: $studentId, status: $status) {
      id
      amountDue
      status
      dueDate
      description
      student {
        id
        admissionNo
        user {
          name
        }
      }
      payments {
        id
        amount
        method
        paidAt
      }
    }
  }
`;

export const GET_USERS = gql`
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
`;
