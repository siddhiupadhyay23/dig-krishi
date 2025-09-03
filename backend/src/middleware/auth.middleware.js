const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header or cookie
        let token = req.header('Authorization');
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid token. User not found.'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid token.'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired.'
            });
        }
        
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

module.exports = authMiddleware;
