const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
//const authMiddleware = require('../middleware/authMiddleware');

// Protect routes with authMiddleware
//router.use(authMiddleware);

// Plan actions
router.get('/', planController.viewPlans);
router.post('/', planController.createPlan);
router.delete('/:id', planController.deletePlan);
router.put('/:id/update-plan', planController.updatePlan); 
// Feature actions
router.post('/add-feature', planController.addFeatureToPlan);
router.delete('/remove-feature', planController.removeFeatureFromPlan);
router.get('/:planId/features', planController.fetchFeatures); 


module.exports = router;
