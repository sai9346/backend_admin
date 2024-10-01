const express = require('express');
const router = express.Router();
const {
    deactivateAccount,
    reactivateAccount,
} = require('../controllers/accountController');

// Deactivate user account
router.post('/deactivate', deactivateAccount);

// Reactivate user account
router.post('/reactivate', reactivateAccount);

module.exports = router;
