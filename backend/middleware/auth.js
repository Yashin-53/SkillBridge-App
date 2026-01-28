const jwt = require('jsonwebtoken');
const User = require('../models/user.js'); 


module.exports.protect = async (req, res, next) => {
    let token;
    const secret = process.env.JWT_SECRET; 

    if (!secret) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env file. Authentication cannot proceed securely.");
       
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
           
            token = req.headers.authorization.split(' ')[1];

          
            const decoded = jwt.verify(token, secret);

            
            const currentUser = await User.findById(decoded.id).select('-password');

          
            if (!currentUser) {
               
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }
            
            
            req.user = currentUser; 
            
            next(); 

        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};
