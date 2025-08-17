# Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank White Page at http://localhost:3000

**Symptoms**: 
- Browser shows a blank white page
- No content or error messages visible
- Development server appears to be running

**Solutions**:

#### Clear Next.js Cache and Restart
```bash
# Stop development server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev
```

#### Check Browser Console
- Open browser Developer Tools (F12)
- Look for JavaScript errors in Console tab
- Check Network tab for failed requests

#### Port Conflicts
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port if needed
npm run dev -- -p 3001
```

### 2. API Errors (500 Internal Server Error)

**Symptoms**:
- Summarization fails with error messages
- Email sending doesn't work
- API calls return 500 errors

**Solutions**:

#### Missing Environment Variables
1. Ensure `.env.local` exists:
   ```bash
   cp .env.sample .env.local
   ```

2. Add required API keys:
   ```env
   GOOGLE_API_KEY=your_google_ai_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   EMAIL_FROM="Your App <noreply@yourdomain.com>"
   ```

3. Restart development server after adding environment variables

#### Invalid API Keys
- **Google AI API**: Get valid key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Resend API**: Get valid key from [Resend Dashboard](https://resend.com/api-keys)
- Test keys are working by making a simple API call

### 3. File Upload Issues

**Symptoms**:
- File upload button doesn't respond
- Error: "Invalid file type"
- File content not being processed

**Solutions**:
- Only `.txt` files are supported
- Maximum file size: 200KB
- Ensure file has proper text content (not binary)
- Try copy-pasting content instead of file upload

### 4. Email Sending Failures

**Common Issues**:
- "Failed to send email" error
- Recipients not receiving emails
- Invalid email format errors

**Solutions**:
- Verify recipient email addresses are valid
- Check Resend API key is correct and has permissions
- Ensure `EMAIL_FROM` domain is verified in Resend
- Maximum 20 recipients per email
- Check email content isn't too large (max 50KB)

### 5. Build/TypeScript Errors

**Symptoms**:
- Build fails with TypeScript errors
- Type checking errors in terminal

**Solutions**:
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for build issues
npm run build

# If using wrong Node.js version
nvm use 18  # or node version manager you use
```

## Quick Debugging Steps

### 1. Check Server Logs
Look at terminal running `npm run dev` for error messages

### 2. Test API Endpoints
```bash
# Test summarize endpoint
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"transcriptText": "Test meeting content", "customPrompt": ""}'

# Test email endpoint
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": ["test@example.com"], "subject": "Test", "body": "Test content"}'
```

### 3. Verify Environment
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if environment variables are loaded
echo $GOOGLE_API_KEY  # (will show in terminal)
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production build
npm start

# Clean install
rm -rf node_modules package-lock.json && npm install
```

## Complete Reset (Last Resort)

If nothing else works:

```bash
# Remove all generated files
rm -rf .next node_modules package-lock.json .env.local

# Copy environment template
cp .env.sample .env.local

# Add your API keys to .env.local
# Then reinstall and restart
npm install
npm run dev
```

## System Requirements

- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher  
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **API Keys**: Valid Google AI and Resend API keys

## Getting Help

1. Check browser DevTools Console for client-side errors
2. Check terminal output for server-side errors  
3. Verify all environment variables are set correctly
4. Test with minimal input first (short text, single email recipient)
5. Check API provider status pages if issues persist
