#!/bin/bash
set -e

echo "🔨 Building Revolt Backend..."

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install Chrome for Puppeteer
echo "🌐 Installing Chrome browser for Puppeteer..."
npx puppeteer browsers install chrome

# Verify Chrome installation
echo "✅ Checking Chrome installation..."
CHROME_PATH=$(find ~/.cache/puppeteer -name "chrome" -type f 2>/dev/null | head -1)
if [ -z "$CHROME_PATH" ]; then
  CHROME_PATH=$(find /opt/render -name "chrome" -type f 2>/dev/null | head -1)
fi

if [ -n "$CHROME_PATH" ]; then
  echo "✅ Chrome found at: $CHROME_PATH"
else
  echo "⚠️  Chrome executable not automatically found, will rely on Puppeteer cache"
fi

echo "🎉 Build complete!"
