const express = require('express');
const {
  getAllUsers,
  getUserUsageHistory,
  getUserProfile,
  getAllUserProfiles,
  createUser,
  assignChangePlan,
  bulkAssignPlans
} = require('../controllers/userController');

const router = express.Router();

// Define routes
router.get('/profiles', getAllUserProfiles); // Get all user profiles with minimal info
router.get('/:id/usage-history', getUserUsageHistory); // Get usage history by user ID
router.get('/:id/profile', getUserProfile); // Get individual user profile by user ID
router.get('/', getAllUsers); // Get all users
router.post('/', createUser);

// Assign/Change Plan for a single user
router.post('/assign-plan', assignChangePlan);

// Bulk Assign Plans
router.post('/bulk-assign-plans', bulkAssignPlans);

module.exports = router;
