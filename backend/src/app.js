const express = require('express');
const cookieParser = require("cookie-parser")
const connectToDb = require("./db/db")

//Routes
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.routes")

const app = express();
connectToDb()

//using middlewares
app.use(express.json())
app.use(cookieParser())

//using Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat",chatRoutes);

module.exports = app;