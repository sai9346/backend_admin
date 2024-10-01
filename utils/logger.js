const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/activity.log');

const logAction = (action, details) => {
    const logEntry = `${new Date().toISOString()} - ACTION: ${action} - DETAILS: ${JSON.stringify(details)}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Failed to log action:', err);
    });
};

module.exports = { logAction };
