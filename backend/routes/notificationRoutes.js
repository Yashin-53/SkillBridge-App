const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


const { protect } = require('../middleware/auth'); 

/**
 * @route   GET /api/notifications
 */

router.get('/', protect, async (req, res) => {
    try {
        
        const userId = req.user._id; 

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50); 

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            read: false
        });

        res.json({
            notifications: notifications,
            unreadCount: unreadCount
        });

    } catch (error) {
        console.error("Notification Route Error:", error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   PUT /api/notifications/:id/read
 */
router.put('/:id/read', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;