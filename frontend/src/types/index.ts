export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    createdAt: string;
    updatedAt: string;
    student?: Student;
    teacher?: Teacher;
}

export interface Student {
    id: string;
    userId: string;
    admissionNo: string;
    dob: string;
    gender: Gender;
    address?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    enrollments: Enrollment[];
    attendances: Attendance[];
    examResults: ExamResult[];
    feeInvoices: FeeInvoice[];
}

export interface Teacher {
    id: string;
    userId: string;
    hireDate: string;
    specialization?: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}

export interface ClassSection {
    id: string;
    className: string;
    sectionName: string;
    academicYear: string;
    capacity: number;
    createdAt: string;
    updatedAt: string;
    enrollments: Enrollment[];
    attendances: Attendance[];
    exams: Exam[];
}

export interface Enrollment {
    id: string;
    studentId: string;
    classSectionId: string;
    enrolledOn: string;
    createdAt: string;
    student: Student;
    classSection: ClassSection;
}

export interface Attendance {
    id: string;
    studentId: string;
    classSectionId: string;
    date: string;
    status: AttendanceStatus;
    recordedBy: string;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    student: Student;
    classSection: ClassSection;
    recorder: User;
}

export interface Exam {
    id: string;
    name: string;
    subject: string;
    maxMarks: number;
    examDate: string;
    classSectionId: string;
    createdAt: string;
    updatedAt: string;
    classSection: ClassSection;
    results: ExamResult[];
}

export interface ExamResult {
    id: string;
    examId: string;
    studentId: string;
    obtainedMarks: number;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    exam: Exam;
    student: Student;
}

export interface FeeInvoice {
    id: string;
    studentId: string;
    amountDue: number;
    status: InvoiceStatus;
    dueDate: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    student: Student;
    payments: Payment[];
}

export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    txRef?: string;
    paidAt: string;
    createdAt: string;
    invoice: FeeInvoice;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface StudentConnection {
    data: Student[];
    pagination: PaginationInfo;
}
