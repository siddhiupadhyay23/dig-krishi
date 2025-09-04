const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser")
const connectToDb = require("./db/db")

//Routes
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.routes")
const profileRoutes = require("./routes/profile.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const debugRoutes = require("./routes/debug.routes")

const app = express();
connectToDb()

//using middlewares
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"], // Frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

//using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/debug", debugRoutes);

module.exports = app;