const User = require('../models/User');
const moment = require('moment');

// View upcoming plan expirations
const viewUpcomingExpirations = async (req, res) => {
    const { days } = req.query;
    const upcomingDate = moment().add(days, 'days').toDate();

    try {
        const users = await User.find({ expirationDate: { $lte: upcomingDate } });
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to view upcoming expirations:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Manual renewal of plan
const renewPlan = async (req, res) => {
    const { userId, additionalDays } = req.body;

    if (!userId || !additionalDays) {
        return res.status(400).json({ message: 'User ID and additional days are required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.expirationDate = moment(user.expirationDate).add(additionalDays, 'days').toDate();
        await user.save();

        // Notify user of renewal (implement your notification logic here)
        console.log(`Success: Plan renewed for user ${user.email} until ${user.expirationDate}`);
        res.status(200).json({ message: 'Plan renewed successfully' });
    } catch (error) {
        console.error('Failed to renew plan:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Export the functions for use in your routes
module.exports = {
    viewUpcomingExpirations,
    renewPlan,
};
