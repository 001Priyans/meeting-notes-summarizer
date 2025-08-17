#!/bin/bash

echo "🧪 Testing Gemini API Integration"
echo "=================================="

# Load environment variables
if [ -f .env.local ]; then
    source .env.local
    echo "✅ Environment variables loaded"
else
    echo "❌ .env.local file not found"
    exit 1
fi

# Test Node.js can import the package
echo -e "\n📦 Testing Google Generative AI package..."
node -e "
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  console.log('✅ Package import successful');
} catch (e) {
  console.log('❌ Package import failed:', e.message);
  process.exit(1);
}
" || exit 1

# Test basic Gemini API call
echo -e "\n🤖 Testing Gemini API call..."
node -e "
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello, write a short greeting.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API call successful');
    console.log('📝 Response:', text.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Gemini API call failed:', error.message);
    process.exit(1);
  }
}

testGemini();
" || exit 1

echo -e "\n🎉 All tests passed! Gemini integration is working."
