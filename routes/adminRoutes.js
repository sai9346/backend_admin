const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  viewAllUsers,
  changePlan,
  bulkAssignPlans,
  viewAllPlans,
  modifyPlanDetails,
  trackPlanUsers,
} = require('../controllers/adminController'); // Ensure this path is correct

const router = express.Router();

// Register Admin
router.post('/register', registerAdmin);

// Login Admin
router.post('/login', loginAdmin);

// View All Users
router.get('/users', viewAllUsers);

// Change Plan
router.put('/change-plan', changePlan);

// Bulk Assign Plans
router.put('/bulk-assign-plans', bulkAssignPlans);

// View All Plans
router.get('/plans', viewAllPlans);

// Modify Plan Details
router.put('/modify-plan/:planId', modifyPlanDetails);

// Track Plan Users
router.get('/track-plan-users', trackPlanUsers);

module.exports = router;
