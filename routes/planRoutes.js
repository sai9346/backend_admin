const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect routes with authMiddleware
router.use(authMiddleware);

// Plan actions
router.get('/', planController.viewPlans);
router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

// Feature actions
router.post('/add-feature', planController.addFeatureToPlan);
router.delete('/remove-feature', planController.removeFeatureFromPlan);

module.exports = router;
