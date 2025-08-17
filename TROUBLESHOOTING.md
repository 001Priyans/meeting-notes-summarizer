# Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank White Page at http://localhost:3000

**Symptoms**: 
- Browser shows a blank white page
- No content or error messages visible
- Development server appears to be running

**Causes & Solutions**:

#### A. React Version Compatibility
The application was tested with React 18. If you see a blank page, check your React version:

```bash
# Check current React version
npm list react

# If using React 19, downgrade to React 18
npm install react@^18.2.0 react-dom@^18.2.0 @types/react@^18.2.0 @types/react-dom@^18.2.0
```

#### B. Development Server Not Starting Properly
```bash
# Stop any existing processes
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start development server
npm run dev
```

#### C. Port Conflicts
```bash
# Check if port 3000 is in use
netstat -tlnp | grep :3000

# If port is busy, kill the process or use a different port
npm run dev -- -p 3001
```

#### D. TypeScript Compilation Errors
```bash
# Check for TypeScript errors
npm run type-check

# Check for build errors
npm run build
```

### 2. API Errors (500 Internal Server Error)

**Symptoms**:
- Page loads but API calls fail
- Error messages in browser console
- Summarization or email features don't work

**Solutions**:

#### A. Missing Environment Variables
1. Copy the environment template:
   ```bash
   cp .env.sample .env.local
   ```

2. Add your API keys to `.env.local`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   ```

#### B. Invalid API Keys
- Verify your Groq API key at [https://console.groq.com](https://console.groq.com)
- Verify your Resend API key at [https://resend.com/api-keys](https://resend.com/api-keys)

### 3. File Upload Issues

**Symptoms**:
- File upload doesn't work
- Error messages about file type or size

**Solutions**:
- Only `.txt` files are supported (max 200KB)
- Ensure file has proper `.txt` extension
- Check file size: `ls -lh your-file.txt`

### 4. Email Sending Failures

**Common Issues**:
- Invalid email addresses
- Missing email provider API keys
- Rate limiting

**Solutions**:
- Verify email addresses are valid
- Check API key configuration
- Try with fewer recipients (max 20)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run type-check

# Run automated tests
./test.sh
```

## Getting Help

1. **Check browser console** for JavaScript errors
2. **Check terminal output** for server-side errors
3. **Verify environment variables** are set correctly
4. **Test API endpoints** directly using curl:

```bash
# Test summarize endpoint
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"transcriptText": "Test meeting", "customPrompt": "Brief summary"}'

# Test email endpoint (will fail without API keys)
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": ["test@example.com"], "subject": "Test", "body": "Test message"}'
```

## System Requirements

- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher
- **OS**: Linux, macOS, or Windows
- **Browser**: Modern browser with JavaScript enabled

## Quick Reset

If all else fails, try a complete reset:

```bash
# Remove all generated files
rm -rf .next node_modules package-lock.json

# Reinstall everything
npm install

# Start fresh
npm run dev
```
