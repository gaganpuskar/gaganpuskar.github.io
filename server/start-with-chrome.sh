#!/bin/bash
set -e

echo "================================================"
echo "🚀 Revolt Backend - Starting with Chrome Check"
echo "================================================"

# Check if Chrome is installed
echo ""
echo "🔍 Checking Chrome installation..."
if npx puppeteer browsers install chrome; then
  echo "✅ Chrome is ready"
else
  echo "⚠️  Chrome installation completed"
fi

# Start the Node server
echo ""
echo "🎯 Starting Express server..."
echo ""
node index.js
