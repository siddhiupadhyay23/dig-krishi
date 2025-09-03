#!/bin/bash

echo "🚀 Starting Digital Krishi Officer Development Servers..."

# Start backend in the background
echo "📡 Starting Backend Server on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in the background  
echo "🌐 Starting Frontend Server on port 3001..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo "📡 Backend: http://localhost:5000"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "💡 Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
