#!/bin/bash
# Vercel build script

echo "🔨 Starting build process..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🏗️  Building frontend..."
npm run build

echo "✅ Build complete!"
