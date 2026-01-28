const Message = require('../models/message.js');
const User = require('../models/user.js');
const mongoose = require('mongoose');

module.exports.getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender_id: loggedInUserId }, { receiver_id: loggedInUserId }]
        }).sort({ createdAt: -1 }); 

        
        const userIds = new Set();
        messages.forEach(msg => {
          
            if (msg.sender_id.toString() !== loggedInUserId.toString()) {
                userIds.add(msg.sender_id.toString());
            }
            if (msg.receiver_id.toString() !== loggedInUserId.toString()) {
                userIds.add(msg.receiver_id.toString());
            }
        });

        
        const conversations = await User.find({
            _id: { $in: Array.from(userIds) }
        }).select('name role avatarUrl'); 

        res.status(200).json({ conversations });

    } catch (error) {
        console.error("Get Conversations Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports.getMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.otherUserId;

        
        const messages = await Message.find({
            $or: [
                { sender_id: loggedInUserId, receiver_id: otherUserId },
                { sender_id: otherUserId, receiver_id: loggedInUserId }
            ]
        })
        .populate('sender_id','name avatarUrl role')
        .sort({ createdAt: 'asc' }) // Show oldest first
        .limit(100); // Limit to last 100 messages

        res.status(200).json({ messages });

    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};