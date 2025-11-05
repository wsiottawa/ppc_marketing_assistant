#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Google Ads API Server...\n');

// Check if package.json exists
const packageJsonPath = path?.join(__dirname, 'package.json');
if (!fs?.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in server directory');
  console.log('💡 Solution: Ensure package.json exists in the server folder');
  process.exit(1);
}

// Check if .env exists
const envPath = path?.join(__dirname, '.env');
if (!fs?.existsSync(envPath)) {
  console.error('❌ .env file not found in server directory');
  console.log('💡 Solution: Create .env file with your Google Ads API credentials');
  console.log('📖 See server/.env.example for required variables');
  process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path?.join(__dirname, 'node_modules');
if (!fs?.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  
  exec('npm install', { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to install dependencies:', error);
      process.exit(1);
    }
    
    console.log('✅ Dependencies installed successfully');
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('🌟 Starting server...');
  
  // Start the server
  const server = exec('node server.js', { cwd: __dirname });
  
  server?.stdout?.on('data', (data) => {
    process.stdout?.write(data);
  });
  
  server?.stderr?.on('data', (data) => {
    process.stderr?.write(data);
  });
  
  server?.on('close', (code) => {
    console.log(`\n👋 Server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    server?.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    server?.kill('SIGTERM');
  });
}