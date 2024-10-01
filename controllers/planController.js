const Plan = require('../models/Plan');
const User = require('../models/User'); // Assuming a User model exists

// View All Plans
const viewPlans = async (req, res) => {
    try {
        const plans = await Plan.find().populate('features'); // Populate feature details if needed
        res.status(200).json(plans);
    } catch (err) {
        console.error('Failed to view plans:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Create a New Plan
const createPlan = async (req, res) => {
    const { name, description, price, features } = req.body;

    // Check if the provided name is valid based on enum
    if (!['Basic', 'Premium', 'VIP'].includes(name)) {
        return res.status(400).json({ message: 'Invalid plan name provided.' });
    }

    try {
        const plan = new Plan({ name, description, price, features });
        await plan.save();
        console.log(`Success: Plan "${name}" created.`);
        res.status(201).json({ message: 'Plan created successfully', plan });
    } catch (err) {
        console.error('Failed to create plan:', err.message);
        res.status(500).json({ message: 'Failed to create plan', error: err.message });
    }
};

// Update an Existing Plan
const updatePlan = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, features } = req.body;

    try {
        const updatedPlan = await Plan.findByIdAndUpdate(
            id,
            { name, description, price, features },
            { new: true, runValidators: true }
        );
        
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({ message: 'Plan updated successfully', updatedPlan });
    } catch (err) {
        console.error('Failed to update plan:', err.message);
        res.status(500).json({ message: 'Failed to update plan', error: err.message });
    }
};

// Delete a Plan
const deletePlan = async (req, res) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findByIdAndDelete(id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
        console.error('Failed to delete plan:', err.message);
        res.status(500).json({ message: 'Failed to delete plan', error: err.message });
    }
};

// Add feature to a plan
const addFeatureToPlan = async (req, res) => {
    const { planId, featureId } = req.body;

    try {
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        plan.features.push(featureId);
        await plan.save();

        console.log(`Success: Feature added to plan "${plan.name}".`);
        res.status(200).json({ message: 'Feature added successfully' });
    } catch (error) {
        console.error('Failed to add feature:', error.message);
        res.status(500).json({ message: 'Failed to add feature', error: error.message });
    }
};

// Remove feature from a plan
const removeFeatureFromPlan = async (req, res) => {
    const { planId, featureId } = req.body;

    try {
        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        plan.features.pull(featureId); // Remove the feature
        await plan.save();

        console.log(`Success: Feature removed from plan "${plan.name}".`);
        res.status(200).json({ message: 'Feature removed successfully' });
    } catch (error) {
        console.error('Failed to remove feature:', error.message);
        res.status(500).json({ message: 'Failed to remove feature', error: error.message });
    }
};

module.exports = {
    viewPlans,
    createPlan,
    updatePlan,
    deletePlan,
    addFeatureToPlan,
    removeFeatureFromPlan,
};
