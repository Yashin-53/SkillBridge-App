const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['volunteer', 'ngo'] }, 
    location: { type: String },
    bio: { type: String },
    avatarUrl: {
        type: String,
        default: 'https://res.cloudinary.com/df7lfelei/image/upload/v1762706749/346569_qv3txb.png'
    },

    
    skills: { type: [String], default: [] }, 

    organization_name: { 
        type: String, 
        required: function() { return this.role === 'ngo'; }
    },
    organization_description: { type: String },
    website_url: { type: String }

}, { timestamps: true }); 

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); 
    }
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
