#!/bin/bash

# World Cup Schedule - Setup Script
# Automated setup for development environment

set -e

echo "🎉 World Cup Schedule - Development Setup"
echo "=========================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed"
echo ""

# Create environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Football-Data.org API key"
    echo ""
fi

# Verify Angular CLI
echo "🔍 Checking Angular CLI..."
npx ng version

echo ""
echo "=========================================="
echo "✅ Setup completed successfully!"
echo ""
echo "🚀 Next steps:"
echo "  1. Update .env with your API key"
echo "  2. Run: npm start"
echo "  3. Open: http://localhost:4200"
echo ""
echo "📖 For more info, see README_FULL.md and DEVELOPMENT.md"
echo ""
