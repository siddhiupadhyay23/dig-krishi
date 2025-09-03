const express = require("express")
const {authMiddleware} = require("../middlewares/auth.middleware")

const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
    res.json({ message: "Chat endpoint working" });
});


module.exports = router;