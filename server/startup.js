/**
 * Startup wrapper that ensures Chrome is installed before starting the server
 */
const { spawn } = require('child_process');
const path = require('path');

async function ensureChromeInstalled() {
  console.log('🔍 Checking Chrome installation...');
  
  try {
    // Try to import puppeteer and check for Chrome
    const puppeteer = require('puppeteer');
    
    // This will attempt to find Chrome and show us where it is
    const browserFetcher = puppeteer.createBrowserFetcher();
    const revisions = await browserFetcher.localRevisions();
    
    if (revisions.length > 0) {
      console.log('✅ Chrome found:', revisions);
      return true;
    }
    
    console.log('⚠️  No local Chrome found, installing...');
    return installChrome();
  } catch (error) {
    console.error('❌ Error checking Chrome:', error.message);
    return installChrome();
  }
}

async function installChrome() {
  return new Promise((resolve) => {
    console.log('📥 Running: npx puppeteer browsers install chrome');
    
    const install = spawn('npx', ['puppeteer', 'browsers', 'install', 'chrome'], {
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Chrome installed successfully');
        resolve(true);
      } else {
        console.log('⚠️  Chrome installation completed with code:', code);
        resolve(true); // Continue anyway
      }
    });
    
    install.on('error', (error) => {
      console.error('❌ Chrome installation error:', error);
      resolve(true); // Continue anyway
    });
  });
}

async function startServer() {
  await ensureChromeInstalled();
  
  console.log('🚀 Starting Node server...');
  require('./index.js');
}

startServer().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
