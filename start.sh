#!/bin/bash

# Weather Intelligence System - Development Starter

echo "🌤️  Starting Weather Intelligence System..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating from example..."
    cp .env.example .env
    echo "❗ Please edit .env with your credentials before continuing"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check ports
if check_port 5000; then
    echo "⚠️  Port 5000 is already in use"
    echo "Please stop the process using port 5000 or change PORT in .env"
    exit 1
fi

if check_port 3000; then
    echo "⚠️  Port 3000 is already in use"
    echo "Please stop the process using port 3000"
    exit 1
fi

echo "✅ Ports available"
echo ""

# Start backend in background
echo "🔧 Starting Backend Server..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if ! check_port 5000; then
    echo "❌ Backend failed to start. Check backend.log for errors"
    exit 1
fi
echo "✅ Backend running on http://localhost:5000"

# Start frontend
echo ""
echo "🎨 Starting Frontend..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ Both servers starting..."
echo ""
echo "📋 Server Status:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo "   GraphQL:  http://localhost:5000/graphql"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   Or press Ctrl+C and run: pkill -f 'node.*weather'"
echo ""
echo "Happy coding! 🚀"

# Keep script running
wait
