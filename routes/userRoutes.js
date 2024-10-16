const express = require('express');
const { getAllUsers, getUserUsageHistory, getUserProfile, insertDummyData } = require('../controllers/userController');
const router = express.Router();

// Define your routes here
router.get('/', getAllUsers); // Get all users
router.get('/:id/usage-history', getUserUsageHistory); // Get usage history by user ID
router.get('/:id/profile', getUserProfile); // Get user profile by user ID


// Logging for dummy data insertion
router.post('/dummy-data', (req, res, next) => {
    console.log('Dummy data insertion request received'); // Log the request
    insertDummyData(req, res, next); // Call the controller function to insert dummy data
});

module.exports = router;
