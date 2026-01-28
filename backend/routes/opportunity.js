const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller.js');
const { protect } = require('../middleware/auth.js');


router.post('/', protect, opportunityController.createOpportunity);

// Get all opportunities created by logged-in NGO
router.get('/my', protect, opportunityController.getMyOpportunities);

// Update opportunity (NGO only)
router.put('/:id', protect, opportunityController.updateOpportunity);

// Delete opportunity (NGO only)
router.delete('/:id', protect, opportunityController.deleteOpportunity);

// Get all *open* opportunities (for volunteers)
router.get('/', protect, opportunityController.getAllOpenOpportunities);

router.get('/:id', protect, opportunityController.getOpportunityById);

router.put('/:id', protect, opportunityController.updateOpportunity);

module.exports = router;
