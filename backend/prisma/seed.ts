import { PrismaClient, UserRole, Gender, AttendanceStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Cleanup existing data
    await prisma.payment.deleteMany();
    await prisma.feeInvoice.deleteMany();
    await prisma.examResult.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.classSection.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleaned up database');

    // Create Admin User
    const adminPassword = await bcrypt.hash('SecurePassword123!', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@school.com',
            passwordHash: adminPassword,
            role: UserRole.ADMIN,
        },
    });
    console.log('👤 Created Admin: admin@school.com');

    // Create Teacher User
    const teacherPassword = await bcrypt.hash('TeacherPass123!', 10);
    const teacherUser = await prisma.user.create({
        data: {
            name: 'John Teacher',
            email: 'teacher@school.com',
            passwordHash: teacherPassword,
            role: UserRole.TEACHER,
        },
    });

    const teacher = await prisma.teacher.create({
        data: {
            userId: teacherUser.id,
            hireDate: new Date('2020-01-15'),
            specialization: 'Mathematics',
        },
    });
    console.log('👨‍🏫 Created Teacher: teacher@school.com');

    // Create Class Section
    const classSection = await prisma.classSection.create({
        data: {
            className: 'Grade 10',
            sectionName: 'A',
            academicYear: '2024-2025',
            capacity: 30,
        },
    });
    console.log('🏫 Created Class: Grade 10-A');

    // Create Student User
    const studentPassword = await bcrypt.hash('StudentPass123!', 10);
    const studentUser = await prisma.user.create({
        data: {
            name: 'Alice Student',
            email: 'student@school.com',
            passwordHash: studentPassword,
            role: UserRole.STUDENT,
        },
    });

    const student = await prisma.student.create({
        data: {
            userId: studentUser.id,
            admissionNo: 'ADM001',
            dob: new Date('2008-05-20'),
            gender: Gender.FEMALE,
            address: '123 School Lane',
        },
    });
    console.log('👩‍🎓 Created Student: student@school.com');

    // Enroll Student
    await prisma.enrollment.create({
        data: {
            studentId: student.id,
            classSectionId: classSection.id,
        },
    });
    console.log('📝 Enrolled student in class');

    // Create Exam
    const exam = await prisma.exam.create({
        data: {
            name: 'Mid-Term Math',
            subject: 'Mathematics',
            maxMarks: 100,
            examDate: new Date('2024-10-15'),
            classSectionId: classSection.id,
        },
    });
    console.log('📝 Created Exam: Mid-Term Math');

    // Create Fee Invoice
    await prisma.feeInvoice.create({
        data: {
            studentId: student.id,
            amountDue: 5000,
            dueDate: new Date('2024-12-31'),
            description: 'Term 1 Tuition Fee',
            status: InvoiceStatus.PENDING,
        },
    });
    console.log('💰 Created Fee Invoice');

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
