const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity', 
        required: true
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true 
});

applicationSchema.index({ opportunity: 1, volunteer: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
