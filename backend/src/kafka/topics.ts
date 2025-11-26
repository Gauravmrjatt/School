// Kafka Topics
export const TOPICS = {
    ATTENDANCE_RECORDED: 'attendance.recorded',
    EXAM_RESULTS_PUBLISHED: 'exam.results.published',
    PAYMENT_COMPLETED: 'payment.completed',
    USER_CREATED: 'user.created',
} as const;

// Redis Pub/Sub Channels
export const CHANNELS = {
    ATTENDANCE: (classSectionId: string) => `attendance:${classSectionId}`,
    EXAM_RESULTS: (studentId: string) => `examResults:${studentId}`,
} as const;

// Event Schemas
export interface AttendanceRecordedEvent {
    type: 'ATTENDANCE_RECORDED';
    payload: {
        attendanceId: string;
        studentId: string;
        classSectionId: string;
        date: string;
        status: string;
        recordedBy: string;
    };
    timestamp: string;
}

export interface ExamResultsPublishedEvent {
    type: 'EXAM_RESULTS_PUBLISHED';
    payload: {
        examId: string;
        studentId: string;
        resultId: string;
        obtainedMarks: number;
        maxMarks: number;
        subject: string;
    };
    timestamp: string;
}

export interface PaymentCompletedEvent {
    type: 'PAYMENT_COMPLETED';
    payload: {
        paymentId: string;
        invoiceId: string;
        studentId: string;
        amount: number;
        method: string;
        txRef?: string;
    };
    timestamp: string;
}

export interface UserCreatedEvent {
    type: 'USER_CREATED';
    payload: {
        userId: string;
        email: string;
        role: string;
        name: string;
    };
    timestamp: string;
}

export type KafkaEvent =
    | AttendanceRecordedEvent
    | ExamResultsPublishedEvent
    | PaymentCompletedEvent
    | UserCreatedEvent;
