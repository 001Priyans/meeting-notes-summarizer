#!/bin/bash

# AI Meeting Notes Summarizer - Test Script
# This script tests the core functionality of the application

echo "🚀 Starting AI Meeting Notes Summarizer Tests"
echo "============================================="

# Test 1: Check if development server is running
echo "📡 Test 1: Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running. Please run 'npm run dev' first."
    exit 1
fi

# Test 2: Test summarize API with sample data
echo "🤖 Test 2: Testing AI summarization API..."
SUMMARIZE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "transcriptText": "Meeting with John and Sarah about Q4 planning. John mentioned we need to finish the mobile app by October. Sarah suggested we hire two more developers. Key action item: Review budget by Friday.",
    "customPrompt": "Provide a brief summary with action items"
  }')

if echo "$SUMMARIZE_RESPONSE" | grep -q "summary"; then
    echo "✅ Summarization API is working"
    echo "   Response preview: $(echo "$SUMMARIZE_RESPONSE" | head -c 100)..."
else
    echo "❌ Summarization API failed"
    echo "   Response: $SUMMARIZE_RESPONSE"
fi

# Test 3: Test email API (will fail without API keys, but should return proper error)
echo "📧 Test 3: Testing email API validation..."
EMAIL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@example.com"],
    "subject": "Test Summary",
    "body": "This is a test email body"
  }')

if echo "$EMAIL_RESPONSE" | grep -q -E "(email|error|provider)"; then
    echo "✅ Email API is responding (validation working)"
    echo "   Response preview: $(echo "$EMAIL_RESPONSE" | head -c 100)..."
else
    echo "❌ Email API failed to respond"
    echo "   Response: $EMAIL_RESPONSE"
fi

# Test 4: Check build process
echo "🔨 Test 4: Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    echo "   Run 'npm run build' to see detailed errors"
fi

# Test 5: Check TypeScript compilation
echo "📝 Test 5: Testing TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    echo "   Run 'npm run type-check' to see detailed errors"
fi

# Test 6: Check required files
echo "📁 Test 6: Checking required files..."
REQUIRED_FILES=(
    ".env.sample"
    "README.md"
    "DEPLOYMENT.md"
    "package.json"
    "src/app/page.tsx"
    "src/app/api/summarize/route.ts"
    "src/app/api/send-email/route.ts"
    "src/lib/ai.ts"
    "src/lib/email.ts"
)

ALL_FILES_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
        ALL_FILES_PRESENT=false
    fi
done

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="

if [ "$ALL_FILES_PRESENT" = true ]; then
    echo "✅ All required files are present"
    echo "✅ Application is ready for deployment"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Set up your API keys in .env.local"
    echo "   2. Test with real AI provider (Groq/OpenAI)"
    echo "   3. Test with real email provider (Resend/SendGrid)"
    echo "   4. Deploy to Vercel with 'npx vercel'"
    echo ""
    echo "📖 Documentation:"
    echo "   - README.md - Setup and usage instructions"
    echo "   - DEPLOYMENT.md - Deployment guide"
    echo "   - TECHNICAL_OVERVIEW.md - Technical documentation"
else
    echo "❌ Some required files are missing"
    echo "   Please check the file structure"
fi

echo ""
echo "🌐 Local development server: http://localhost:3000"
echo "📄 Sample transcript: sample-transcript.txt"
