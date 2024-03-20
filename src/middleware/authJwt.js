// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user.models');

// Middleware function to verify JWT token and authenticate user
const verifyToken = async (req, res, next) => {
    // Extract JWT token from request headers
    const token = req.header["x-access-token"];

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token validity
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user associated with the token
        const user = await User.findById(decoded.userId);
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        // Attach user object to request for further processing
        req.user = user;
        next(); // Call the next middleware in the chain
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken; // Export the middleware function with the correct name
