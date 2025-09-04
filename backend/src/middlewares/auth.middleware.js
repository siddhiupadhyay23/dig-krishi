const userModel = require("../models/user.model")

const jwt = require("jsonwebtoken")

async function authMiddleware(req,res,next) {
    
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.token;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }

    if(!token){
        return res.status(401).json({message:"unauthorized"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id)
        
        // Check if user exists
        if (!user) {
            console.error('User not found for token:', decoded.id);
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;

        next();
    }catch(error){
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({message: "Invalid token"});
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: "Token expired"});
        }
        res.status(401).json({message: "unauthorized"});
    }

}

module.exports = {
    authMiddleware
}