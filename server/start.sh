#!/bin/bash
set -e

# Ensure Chrome is installed
echo "🔍 Checking for Chrome..."

# Try to install Chrome in the background
echo "📥 Installing Chrome via Puppeteer..."
npx puppeteer browsers install chrome 2>&1 || echo "Chrome installation completed or skipped"

# Start the Node server
echo "🚀 Starting Node server..."
node index.js
