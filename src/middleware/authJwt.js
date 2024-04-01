const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user.models');

const verifyToken = async (req, res, next) => {
   
    const token = req.headers["x-access-token"];
    if (!token) {
        console.log(token)
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }
        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = { verifyToken }; 
