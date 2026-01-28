const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
   
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        index: true 
    },
  
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
   
    content: {
        type: String,
        required: true
    },
  
    link: {
        type: String,
        required: true
    },
    
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);