#!/bin/bash

# Project Structure Verification Script

echo "🔍 Weather Intelligence System - Project Verification"
echo "====================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
SUCCESS=0
FAILED=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((SUCCESS++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((FAILED++))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((SUCCESS++))
        return 0
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ((FAILED++))
        return 1
    fi
}

echo "📁 Checking Backend Structure..."
echo "--------------------------------"
check_dir "backend"
check_dir "backend/config"
check_dir "backend/graphql"
check_dir "backend/models"
check_dir "backend/routes"
check_dir "backend/services"

echo ""
echo "📄 Checking Backend Files..."
echo "--------------------------------"
check_file "backend/package.json"
check_file "backend/server.js"
check_file "backend/config/database.js"
check_file "backend/graphql/typeDefs.js"
check_file "backend/graphql/resolvers.js"
check_file "backend/models/WeatherRequest.js"
check_file "backend/routes/export.js"
check_file "backend/services/weatherService.js"
check_file "backend/services/youtubeService.js"
check_file "backend/services/airQualityService.js"
check_file "backend/services/newsService.js"
check_file "backend/services/unsplashService.js"
check_file "backend/services/wikipediaService.js"
check_file "backend/services/eventsService.js"
check_file "backend/services/poisService.js"
check_file "backend/services/emailService.js"

echo ""
echo "📁 Checking Frontend Structure..."
echo "--------------------------------"
check_dir "frontend"
check_dir "frontend/public"
check_dir "frontend/src"
check_dir "frontend/src/apollo"
check_dir "frontend/src/components"
check_dir "frontend/src/pages"

echo ""
echo "📄 Checking Frontend Files..."
echo "--------------------------------"
check_file "frontend/package.json"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
check_file "frontend/public/index.html"
check_file "frontend/public/manifest.json"
check_file "frontend/src/App.js"
check_file "frontend/src/index.js"
check_file "frontend/src/index.css"
check_file "frontend/src/apollo/client.js"
check_file "frontend/src/apollo/queries.js"
check_file "frontend/src/pages/Home.jsx"

echo ""
echo "🎨 Checking UI Components..."
echo "--------------------------------"
check_file "frontend/src/components/AnimatedBackground.jsx"
check_file "frontend/src/components/SearchBar.jsx"
check_file "frontend/src/components/WeatherDashboard.jsx"
check_file "frontend/src/components/AirQualityPanel.jsx"
check_file "frontend/src/components/MapComponent.jsx"
check_file "frontend/src/components/VideoGallery.jsx"
check_file "frontend/src/components/CityInfoPanel.jsx"
check_file "frontend/src/components/LoadingScreen.jsx"

echo ""
echo "📚 Checking Documentation..."
echo "--------------------------------"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "API_KEYS_GUIDE.md"
check_file "PROJECT_SUMMARY.md"

echo ""
echo "⚙️  Checking Configuration Files..."
echo "--------------------------------"
check_file "package.json"
check_file ".env.example"
check_file ".gitignore"
check_file "setup.sh"
check_file "start.sh"

echo ""
echo "🔐 Checking Environment Setup..."
echo "--------------------------------"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check for required variables
    if grep -q "MONGODB_URI=" .env; then
        echo -e "${GREEN}✓${NC} MONGODB_URI configured"
    else
        echo -e "${YELLOW}⚠${NC} MONGODB_URI not set in .env"
        ((WARNINGS++))
    fi
    
    if grep -q "PORT=" .env; then
        echo -e "${GREEN}✓${NC} PORT configured"
    else
        echo -e "${YELLOW}⚠${NC} PORT not set in .env"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} .env file not found (will use .env.example as template)"
    ((WARNINGS++))
fi

echo ""
echo "📦 Checking Dependencies..."
echo "--------------------------------"

# Check if node_modules exist
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Root dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Root dependencies not installed (run: npm install)"
    ((WARNINGS++))
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd backend && npm install)"
    ((WARNINGS++))
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: cd frontend && npm install)"
    ((WARNINGS++))
fi

echo ""
echo "═══════════════════════════════════════════"
echo "📊 Verification Summary"
echo "═══════════════════════════════════════════"
echo -e "${GREEN}✓ Successful checks: $SUCCESS${NC}"
echo -e "${RED}✗ Failed checks: $FAILED${NC}"
echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}🎉 Perfect! All files and configurations are in place!${NC}"
        echo ""
        echo "🚀 Ready to launch!"
        echo "   Run: npm run dev"
        echo "   Or: ./start.sh"
    else
        echo -e "${YELLOW}⚠️  Project structure is complete but requires setup${NC}"
        echo ""
        echo "📝 Next steps:"
        [ ! -f ".env" ] && echo "   1. Create .env file: cp .env.example .env"
        [ ! -d "node_modules" ] && echo "   2. Install dependencies: ./setup.sh"
        echo ""
        echo "Then run: npm run dev"
    fi
else
    echo -e "${RED}❌ Some files are missing. Please review the errors above.${NC}"
    exit 1
fi

echo ""
echo "📖 For detailed instructions, see:"
echo "   - README.md (comprehensive guide)"
echo "   - QUICKSTART.md (5-minute setup)"
echo "   - API_KEYS_GUIDE.md (API configuration)"
echo ""
