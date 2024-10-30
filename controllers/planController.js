const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const Feature = require('../models/Feature');

// View All Plans
const viewPlans = async (req, res) => {
    try {
        const plans = await Plan.find().populate('features');
        res.status(200).json(plans);
    } catch (err) {
        console.error('Failed to view plans:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Create a New Plan
const createPlan = async (req, res) => {
    const { name, description, price, features } = req.body;

    if (!['Basic', 'Premium', 'VIP'].includes(name)) {
        return res.status(400).json({ message: 'Invalid plan name provided.' });
    }

    try {
        const plan = new Plan({ name, description, price, features });
        await plan.save();
        res.status(201).json({ message: 'Plan created successfully', plan });
    } catch (err) {
        console.error('Failed to create plan:', err.message);
        res.status(500).json({ message: 'Failed to create plan', error: err.message });
    }
};

// Update an Existing Plan
const updatePlan = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid plan ID provided.' });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(
            id,
            { name, description, price },
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid plan ID provided.' });
        }

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

// Add a Feature to a Plan
const addFeatureToPlan = async (req, res) => {
    const { planId, feature } = req.body;

    if (!planId || !feature) {
        return res.status(400).json({ message: 'Plan ID and feature data are required.' });
    }

    const { name, quota, description } = feature;

    if (!name || !quota || !description) {
        return res.status(400).json({ message: 'Feature name, quota, and description are required.' });
    }

    try {
        const newFeature = new Feature({ name, quota, description });
        await newFeature.save();

        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({ message: 'Invalid plan ID provided.' });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(
            planId,
            { $addToSet: { features: newFeature._id } },
            { new: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found.' });
        }

        res.status(200).json({ message: 'Feature added to plan successfully.', updatedPlan });
    } catch (error) {
        console.error('Error adding feature to plan:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove a Feature from a Plan
const removeFeatureFromPlan = async (req, res) => {
    const { planId, featureId } = req.body;

    if (!planId || !featureId) {
        return res.status(400).json({ message: 'Plan ID and feature ID are required.' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(planId) || !mongoose.Types.ObjectId.isValid(featureId)) {
            return res.status(400).json({ message: 'Invalid plan ID or feature ID provided.' });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(
            planId,
            { $pull: { features: featureId } },
            { new: true }
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({ message: 'Feature removed from plan successfully', updatedPlan });
    } catch (err) {
        console.error('Failed to remove feature from plan:', err.message);
        res.status(500).json({ message: 'Failed to remove feature from plan', error: err.message });
    }
};

// Fetch Features for a Plan
const fetchFeatures = async (req, res) => {
    const { planId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({ message: 'Invalid plan ID provided.' });
        }

        const plan = await Plan.findById(planId).populate('features');
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({ features: plan.features });
    } catch (err) {
        console.error('Failed to fetch features:', err.message);
        res.status(500).json({ message: 'Failed to fetch features', error: err.message });
    }
};

module.exports = {
    viewPlans,
    createPlan,
    updatePlan,
    deletePlan,
    addFeatureToPlan,
    removeFeatureFromPlan,
    fetchFeatures 
};