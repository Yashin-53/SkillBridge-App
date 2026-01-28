const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const createToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined. Authentication cannot proceed securely.");
        
        throw new Error("JWT_SECRET must be configured"); 
    }

    return jwt.sign({ id }, secret, { expiresIn: '3d' }); 
};


module.exports.register = async (req, res) => {
    const { 
        name, email, password, role, location, bio, skills, 
        organization_name, organization_description, website_url 
    } = req.body;

    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Name, email, password, and role are required." });
    }
    if (role !== 'volunteer' && role !== 'ngo') {
        return res.status(400).json({ error: "Role must be 'volunteer' or 'ngo'." });
    }
   
    if (role === 'ngo' && (!organization_name || !organization_description)) {
        return res.status(400).json({ error: "Organization name and description are required for NGOs." });
    }
     
    if (role === 'volunteer' && (!skills || skills.length === 0)) {
      
    }


    try {
        
        const userData = {
            name, email, password, role, location, bio,
            ...(role === 'volunteer' && { skills }),
            ...(role === 'ngo' && { organization_name, organization_description, website_url }), 
        };

       
        const user = await User.create(userData);

    
        const token = createToken(user._id);

        
        res.status(201).json({ 
            message: "Registration successful", 
            token, 
            role: user.role,
            
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (err) {
      
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({ error: "Email address already exists." });
        }

        if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ error: messages.join(', ') });
        }
        
        console.error("Registration Error:", err); 
        res.status(500).json({ error: "Server error during registration." });
    }
};



module.exports.login = async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
    
        const user = await User.findOne({ email }).select('+password'); 

        if (!user || !(await user.comparePassword(password))) {
           
            return res.status(401).json({ error: "Invalid email or password" }); 
        }

        
        const token = createToken(user._id);

       
        res.status(200).json({
            message: 'Login successful',
            token,
            role: user.role, 
        
            user: { id: user._id, name: user.name, email: user.email } 
        });

    } catch (err) {
       
        console.error("Login Error:", err); 
        res.status(500).json({ error: "Server error during login." });
    }
};

