# AI Meeting Notes Summarizer

A minimal, production-ready web application for AI-powered meeting notes summarization and email sharing.

## Features

- **File Upload**: Upload .txt files or paste meeting transcripts directly
- **Custom Prompts**: Specify custom instructions for different summary styles
- **AI Summarization**: Uses Groq (Mixtral) or OpenAI for intelligent summarization
- **Editable Summaries**: Edit AI-generated summaries before sharing
- **Email Sharing**: Send summaries to multiple recipients via email
- **Minimal UI**: Clean, functional interface focused on usability

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Provider**: Groq SDK (primary) with OpenAI fallback
- **Email Provider**: Resend (primary) with SendGrid fallback
- **Validation**: Zod for input validation
- **Deployment**: Vercel-ready

## Architecture

```
Browser → Next.js App → API Routes → AI Provider (Groq/OpenAI)
                     → Email Provider (Resend/SendGrid)
```

## API Endpoints

- `POST /api/summarize`: Generate AI summary from transcript
- `POST /api/send-email`: Send summary via email

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.sample .env.local
   ```

3. **Configure your API keys in `.env.local`:**
   ```env
   # AI Provider (choose one or both for fallback)
   GROQ_API_KEY=your_groq_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here

   # Email Provider (choose one)
   RESEND_API_KEY=your_resend_api_key_here
   SENDGRID_API_KEY=your_sendgrid_api_key_here

   # Email Configuration
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Meeting Summarizer
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Deployment

### Vercel (Recommended)

1. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Your app is live!**

### Alternative Platforms

- **Railway**: `railway deploy`
- **Render**: Connect your GitHub repo
- **Fly.io**: Use `fly deploy`

## Usage

1. **Upload or paste** your meeting transcript
2. **Add custom instructions** (optional) - e.g., "Summarize in bullet points for executives"
3. **Click "Generate Summary"** to create AI-powered summary
4. **Edit the summary** as needed
5. **Enter recipient emails** and click "Send Email"

## API Usage

### Generate Summary

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"transcriptText": "Meeting content...", "customPrompt": "Bullet points only"}'
```

### Send Email

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": ["user@example.com"], "subject": "Meeting Summary", "body": "Summary content..."}'
```

## Configuration

### AI Model Settings

```env
AI_MODEL=mixtral-8x7b-32768  # Groq model
AI_TEMPERATURE=0.3           # Creativity level (0-1)
AI_MAX_TOKENS=2048          # Response length limit
```

### Input Limits

- **Transcript**: 200KB max
- **Custom Prompt**: 2KB max
- **Email Recipients**: 20 max
- **Email Body**: 50KB max

## Error Handling

- Input validation with detailed error messages
- Graceful fallbacks between AI/email providers
- User-friendly error notifications
- Comprehensive server-side logging

## Security

- No persistent data storage
- Environment variable protection
- Input sanitization and validation
- CORS configuration
- File type and size restrictions

## Troubleshooting

If you encounter issues (like a blank page at localhost:3000), see the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide for common solutions.

## License

MIT

## Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common solutions
2. Review browser console for client-side errors  
3. Check terminal output for server-side errors
4. Verify environment variables are set correctly
