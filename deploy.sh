#!/bin/bash

echo "🚀 Deploying AI Meeting Notes Summarizer to Vercel"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Ensure dependencies are installed
echo "📦 Installing dependencies..."
npm install

# Build the project to ensure it works
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix any errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo -e "\n🎉 Deployment completed!"
echo "=================================================="
echo "📋 Next Steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Add these environment variables:"
echo "   - GOOGLE_API_KEY (your Gemini API key)"
echo "   - RESEND_API_KEY (your Resend API key)"
echo "   - EMAIL_FROM (your from email address)"
echo "3. Redeploy if needed: vercel --prod"
echo "=================================================="
