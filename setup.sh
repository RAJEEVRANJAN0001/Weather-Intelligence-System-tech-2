#!/bin/bash

echo "🌤️  Weather Intelligence System - Setup Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd frontend
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys and MongoDB URI"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your credentials"
echo "2. Start development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm start"
echo "   - Or both: npm run dev (from root)"
echo ""
echo "🌐 Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - GraphQL: http://localhost:5000/graphql"
echo ""
echo "Happy coding! 🚀"
