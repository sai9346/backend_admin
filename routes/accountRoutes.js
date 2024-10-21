const express = require('express');
const router = express.Router();
const { deactivateAccount, reactivateAccount } = require('../controllers/accountController');

router.post('/deactivate', deactivateAccount);
router.post('/reactivate', reactivateAccount);

module.exports = router;
