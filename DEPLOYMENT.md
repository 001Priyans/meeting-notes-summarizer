# Deployment Guide - Gemini 2.5 Flash AI Meeting Summarizer

## Quick Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add the required environment variables:
     - `GOOGLE_API_KEY` (for Gemini 2.5 Flash)
     - `RESEND_API_KEY` (for email sending)
     - `EMAIL_FROM`
4. **Redeploy:**
   ```bash
   vercel --prod
   ```

## Environment Variables Required

### AI Provider - Gemini 2.5 Flash
```
GOOGLE_API_KEY=AIzaSy...       # Get from https://aistudio.google.com/app/apikey
MODEL_ID=gemini-2.5-flash      # Gemini model identifier
MODEL_TEMPERATURE=0.3          # Creativity level (0-1)
```

### Email Provider
```
RESEND_API_KEY=re_...          # Get from https://resend.com/
SENDGRID_API_KEY=SG....        # Optional fallback
```

### Email Configuration
```
EMAIL_FROM="Meeting Summarizer <noreply@yourdomain.com>"
```

## Testing Deployment

1. **Test Summary Generation:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/summarize \
     -H "Content-Type: application/json" \
     -d '{"transcriptText": "Test meeting content", "customPrompt": "Brief summary"}'
   ```

2. **Test Email Sending:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/send-email \
     -H "Content-Type: application/json" \
     -d '{"to": ["test@example.com"], "subject": "Test", "body": "Test summary"}'
   ```

## Alternative Deployment Options

### Railway
```bash
railway login
railway deploy
```

### Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

### Fly.io
```bash
fly auth login
fly launch
fly deploy
```
