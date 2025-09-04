const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// Test authentication
router.get("/test-auth", authMiddleware, (req, res) => {
    console.log("Debug - req.user:", req.user);
    console.log("Debug - req.user.id:", req.user ? req.user.id : "undefined");
    console.log("Debug - req.headers.authorization:", req.headers.authorization);
    console.log("Debug - req.cookies.token:", req.cookies.token);
    
    res.json({
        message: "Authentication successful",
        user: req.user,
        userId: req.user ? req.user.id : null,
        userExists: !!req.user
    });
});

// Test route without auth
router.get("/ping", (req, res) => {
    res.json({ message: "Server is running" });
});

module.exports = router;
