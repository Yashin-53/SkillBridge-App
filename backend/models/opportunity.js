const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: [true, 'Opportunity title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    required_skills: {
        type: [String], 
        default: []
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
   
    timestamps: true 
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
