/**
 * Startup wrapper that ensures Chrome is installed before starting the server
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function ensureChromeInstalled() {
  console.log('🔍 Checking Chrome installation...');
  
  try {
    const puppeteer = require('puppeteer');
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisions = await browserFetcher.localRevisions();
    
    if (revisions.length > 0) {
      console.log('✅ Chrome found:', revisions);
      return true;
    }
    
    console.log('⚠️  No local Chrome found, installing...');
    return installChrome();
  } catch (error) {
    console.error('Error checking Chrome:', error.message);
    return installChrome();
  }
}

function installChrome() {
  return new Promise((resolve) => {
    console.log('📥 Installing Chrome via: npx puppeteer browsers install chrome');
    
    const install = spawn('npm', ['run', 'postinstall'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      cwd: __dirname
    });
    
    install.on('close', (code) => {
      console.log('✅ Chrome installation process completed');
      resolve(true);
    });
    
    install.on('error', (error) => {
      console.error('Chrome installation error:', error.message);
      resolve(true); // Continue anyway
    });
  });
}

async function startServer() {
  console.log('🚀 Starting Revolt Backend with Chrome...');
  await ensureChromeInstalled();
  
  console.log('\n✨ Launching Express server...\n');
  require('./index.js');
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
