require('dotenv').config();
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { generateResponse } = require("./src/services/ai.service");
const { text } = require('stream/consumers');

const httpServer = createServer(app);

const chatHistory = [
];


const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"], // Allow Vite dev server
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("message", (msg) => {
    console.log("Message received: ", msg);
  });

  socket.on("ai-message", async (data)=>{

    chatHistory.push({
      role:"user",
      parts:[{text:data}]
    })

    const response = await generateResponse(chatHistory);

    chatHistory.push({
      role:"model",
      parts:[{text:response}]
    })

    console.log("AI Response: ", response);
    socket.emit("ai-message-response", {response});
  });
});

httpServer.listen((3000),()=>{
    console.log("Server is running on port 3000");
 })