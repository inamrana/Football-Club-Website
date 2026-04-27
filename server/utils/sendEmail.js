const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const isEmailConfigured = () =>
    Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your_email@gmail.com');

const getStudentEmail = (student) => {
    if (student.email && student.email.includes('@')) return student.email;
    if (student.contact && student.contact.includes('@')) return student.contact;
    return '';
};

const sendRegistrationNotification = async (studentData) => {
    if (!isEmailConfigured() || !process.env.ADMIN_EMAIL) return;

    try {
        await transporter.sendMail({
            from: `"Super Starter FC" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Student Registration - Super Starter FC',
            text: `A new student has registered.\n\nName: ${studentData.full_name}\nAge: ${studentData.age}\nGuardian: ${studentData.guardian}\nContact: ${studentData.contact}\nExperience: ${studentData.experience || 'None'}\n\nPlease review this in the admin dashboard.`
        });
    } catch (error) {
        console.error('Error sending email notification to admin:', error);
    }
};

const sendWelcomeEmail = async (studentData) => {
    if (!isEmailConfigured()) return;
    const toEmail = getStudentEmail(studentData);
    if (!toEmail) return;

    try {
        await transporter.sendMail({
            from: `"Super Starter FC" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Welcome to Super Starter FC!',
            text: `Hello ${studentData.guardian},\n\nYour registration for ${studentData.full_name} has been approved.\nCourse: ${studentData.course || 'General'}\nTimings: ${studentData.classTimings || 'Check dashboard for latest schedule'}\nMonthly Fee: Rs. ${studentData.feeAmount || 0}\n\nBest Regards,\nSuper Starter FC`
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

const sendBroadcast = async (subject, text, bccList) => {
    if (!isEmailConfigured() || !bccList.length) return;
    try {
        return await transporter.sendMail({
            from: `"Super Starter FC" <${process.env.EMAIL_USER}>`,
            bcc: bccList,
            subject,
            text
        });
    } catch (error) {
        console.error('Error sending broadcast:', error);
        throw error;
    }
};

const sendFeePaymentConfirmation = async (studentData, receiptDetails) => {
    if (!isEmailConfigured()) return;
    const toEmail = getStudentEmail(studentData);
    if (!toEmail) return;

    try {
        await transporter.sendMail({
            from: `"Super Starter FC" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Fee Payment Confirmation - Super Starter FC',
            text: `Hello ${studentData.guardian},\n\nFee has been marked as PAID for ${studentData.full_name}.\n\nReceipt No: ${receiptDetails.receiptNo}\nAmount: Rs. ${receiptDetails.amount}\nDate: ${receiptDetails.date}\nCourse: ${studentData.course || 'General'}\n\nThank you.\nSuper Starter FC`
        });
    } catch (error) {
        console.error('Error sending fee confirmation email:', error);
    }
};

const sendScheduleUpdate = async (bccList, courseTitle, scheduleText) => {
    if (!isEmailConfigured() || !bccList.length) return;
    try {
        await transporter.sendMail({
            from: `"Super Starter FC" <${process.env.EMAIL_USER}>`,
            bcc: bccList,
            subject: `Schedule Update - ${courseTitle}`,
            text: `Class schedule has been updated.\n\nCourse: ${courseTitle}\nNew Timing: ${scheduleText}\n\nPlease check dashboard for latest details.`
        });
    } catch (error) {
        console.error('Error sending schedule update email:', error);
    }
};

module.exports = {
    sendRegistrationNotification,
    sendWelcomeEmail,
    sendBroadcast,
    sendFeePaymentConfirmation,
    sendScheduleUpdate,
    getStudentEmail
};
