const nodemailer = require('nodemailer');

const sendNotification = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notification sent');
    } catch (err) {
        console.error('Error sending notification:', err.message);
    }
};

module.exports = { sendNotification };
