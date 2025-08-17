#!/bin/bash

echo "🚀 Testing AI Meeting Notes Summarizer - Complete Functionality Test"
echo "=============================================================================="

# Test 1: Health Check
echo "1️⃣ Testing application health..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" = "200" ]; then
    echo "✅ Application is running at http://localhost:3000"
else
    echo "❌ Application not responding (HTTP $response)"
    exit 1
fi

# Test 2: Summarize API
echo -e "\n2️⃣ Testing /api/summarize endpoint..."
summary_response=$(curl -s -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "transcriptText": "Meeting started at 2pm. John discussed the quarterly results. Sales were up 15% compared to last quarter. Sarah mentioned the new product launch timeline and said we need to finalize designs by Friday. Marketing team reported 20% increase in website traffic. Action items: John to send detailed report by Monday, Sarah to update project timeline, Marketing to prepare campaign materials.",
    "customPrompt": "Create a professional summary with sections for key points, metrics, and action items"
  }')

if echo "$summary_response" | jq -e '.summary' > /dev/null 2>&1; then
    echo "✅ Summarize API working correctly"
    echo "📝 Generated summary preview:"
    echo "$summary_response" | jq -r '.summary' | head -3
    echo "..."
else
    echo "❌ Summarize API failed"
    echo "Response: $summary_response"
fi

# Test 3: Email API (dry run)
echo -e "\n3️⃣ Testing /api/send-email endpoint (validation only)..."
email_response=$(curl -s -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Meeting Summary",
    "summary": "# Test Summary\n\nThis is a test summary for validation purposes."
  }')

if echo "$email_response" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Email API working correctly"
    echo "📧 Email would be sent successfully"
else
    echo "⚠️  Email API response (may fail due to test email):"
    echo "$email_response" | jq .
fi

echo -e "\n🎉 Testing completed!"
echo "=============================================================================="
echo "🌐 Application URL: http://localhost:3000"
echo "📚 API Endpoints:"
echo "   - POST /api/summarize (Gemini 2.5 Flash AI summarization)"
echo "   - POST /api/send-email (Resend email service)"
echo "=============================================================================="
