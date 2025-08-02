#!/bin/bash
# setup.sh - Quick setup script for Crypto Tracker

echo "🚀 Setting up Crypto Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js v16+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example"
    cp .env.example .env
    echo "Please update .env with your CoinGecko API key."
else
    echo "✅ .env file already exists."
fi

echo "🎉 Setup complete! You can now run 'npm start' to launch the app."