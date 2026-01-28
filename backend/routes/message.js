const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller.js');
const { protect } = require('../middleware/auth.js'); 


router.get('/conversations', protect, messageController.getConversations);

// GET /api/messages/:otherUserId
// Gets the message history between the logged-in user and another user
router.get('/:otherUserId', protect, messageController.getMessages);

module.exports = router;