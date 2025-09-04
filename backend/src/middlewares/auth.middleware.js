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
        
        if (!user) {
            console.error('Auth middleware error: User not found with ID:', decoded.id);
            return res.status(401).json({message:"unauthorized - user not found"});
        }

        req.user = user;

        next();
    }catch(error){
        console.error('Auth middleware error:', error);
        res.status(401).json({message:"unauthorized"});

    }

}

module.exports = {
    authMiddleware
}