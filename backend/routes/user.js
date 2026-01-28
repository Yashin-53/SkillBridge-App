const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.js');
const upload = require('../middleware/upload.js');

router.get('/dashboard', protect, userController.getVolunteerDashboard);
router.get('/dashboard-ngo', protect, userController.getNgoDashboard);
router.get('/profile', protect, userController.getUserProfile);

// Use Cloudinary upload
router.put('/profile', protect, upload.single('avatar'), userController.updateUserProfile);
router.delete('/profile/avatar', protect, userController.removeUserAvatar);

module.exports = router;
