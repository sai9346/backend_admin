// cronJob.js
const cron = require('node-cron');
const Billing = require('../models/Billing');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

// Cron job that runs every day at midnight (00:00) to check for plan expirations
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        const sevenDaysFromNow = new Date(today);
        const oneDayFromNow = new Date(today);

        sevenDaysFromNow.setDate(today.getDate() + 7);  // 7 days ahead
        oneDayFromNow.setDate(today.getDate() + 1);     // 1 day ahead

        // Find users whose plans are expiring in 7 days or 1 day
        const expiringPlans = await Billing.find({
            renewalDate: { $in: [sevenDaysFromNow, oneDayFromNow] }
        }).populate('user');

        // Loop through expiring plans and send notifications
        for (const billing of expiringPlans) {
            const user = billing.user;
            const daysLeft = (billing.renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

            let subject = '';
            let text = '';
            if (daysLeft <= 1) {
                subject = 'Your plan expires tomorrow!';
                text = `Dear ${user.name}, your plan will expire in 1 day. Please renew your subscription.`;
            } else if (daysLeft <= 7) {
                subject = 'Your plan expires in 7 days';
                text = `Dear ${user.name}, your plan will expire in 7 days. Please renew your subscription.`;
            }

            // Send email notification
            await sendNotification(user.email, subject, text);
        }
    } catch (error) {
        console.error('Error sending expiration reminders:', error.message);
    }
});
