# Automated Deployment Script for Crypto Trading System
# Run this script in PowerShell as Administrator

Write-Host "🚀 Starting Automated Deployment..." -ForegroundColor Green

# Step 1: Install Firebase CLI
Write-Host "📦 Installing Firebase CLI..." -ForegroundColor Yellow
npm install -g firebase-tools

# Step 2: Login to Firebase
Write-Host "🔐 Logging in to Firebase..." -ForegroundColor Yellow
firebase login

# Step 3: Initialize Firebase (use existing files)
Write-Host "⚙️ Initializing Firebase project..." -ForegroundColor Yellow
firebase init

# Step 4: Deploy Cloud Functions
Write-Host "🚀 Deploying Cloud Functions..." -ForegroundColor Yellow
firebase deploy --only functions

# Step 5: Deploy Hosting
Write-Host "🌐 Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🤖 Bot is now running on Firebase!" -ForegroundColor Green
Write-Host "📱 Test the bot on Telegram by sending /start" -ForegroundColor Cyan

Read-Host "Press Enter to exit"
