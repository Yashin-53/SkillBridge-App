const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller.js');
const { protect } = require('../middleware/auth.js');


router.post(
  '/apply/:opportunityId',
  protect,
  applicationController.applyToOpportunity
);

// Volunteer gets all their applications
router.get(
  '/my',
  protect,
  applicationController.getMyApplications
);

// NGO gets all applications for their posted opportunities
router.get(
  '/ngo',
  protect,
  applicationController.getNgoApplications
);

// NGO updates application status (accept / reject)
router.put(
  '/:id',
  protect,
  applicationController.updateApplicationStatus
);

module.exports = router;
