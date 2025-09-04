require('dotenv').config();
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { generateResponse, generateResponseWithImage } = require("./src/services/ai.service");
const { text } = require('stream/consumers');

const httpServer = createServer(app);

const chatHistory = [
];


const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"], // Allow Vite dev server
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
    try {
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
    } catch (error) {
      console.error("Error processing text message:", error);
      socket.emit("ai-message-error", {error: error.message});
    }
  });

  // Handle messages with images
  socket.on("ai-message-with-image", async (data) => {
    try {
      const { text, imageData, mimeType } = data;
      
      console.log("Received image message:", { text, mimeType });
      
      // Add user message with image to chat history
      chatHistory.push({
        role: "user",
        parts: [
          { text: text || "Please analyze this image." },
          {
            inlineData: {
              data: imageData,
              mimeType: mimeType
            }
          }
        ]
      });

      // Generate response using image analysis
      const response = await generateResponseWithImage(text, imageData, mimeType, chatHistory.slice(0, -1));

      // Add AI response to chat history
      chatHistory.push({
        role: "model",
        parts: [{ text: response }]
      });

      console.log("AI Image Analysis Response:", response);
      socket.emit("ai-message-response", { response, hasImage: true });
    } catch (error) {
      console.error("Error processing image message:", error);
      socket.emit("ai-message-error", { error: error.message });
    }
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export app for testing
module.exports = app;
