# AI Meeting Notes Summarizer

AI-powered meeting transcript summarizer with email sharing functionality using Google Gemini 2.5 Flash.

## Features

- 📁 Upload `.txt` files or paste transcripts directly
- 🤖 AI summarization with custom prompts (Google Gemini 2.5 Flash)
- ✏️ Edit generated summaries before sharing
- 📧 Send summaries to multiple recipients via email
- 🔒 No data persistence - all processing in memory

## Tech Stack

- **Next.js 14** with App Router & TypeScript
- **Google Gemini 2.5 Flash** for AI summarization
- **Resend** for email delivery
- **Zod** for input validation
- **Plain CSS** styling

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.sample .env.local

# Add your API keys to .env.local
GOOGLE_API_KEY=your_gemini_api_key_here
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM="Your App <noreply@yourdomain.com>"

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Keys Required

- **Google AI API**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Resend API**: Get from [Resend](https://resend.com/api-keys)

## API Endpoints

- `POST /api/summarize` - Generate AI summary from transcript
- `POST /api/send-email` - Send summary via email

## Deploy to Vercel

```bash
vercel
# Set environment variables in Vercel dashboard
vercel --prod
```

## Usage

1. Upload a `.txt` file or paste meeting transcript
2. Add custom prompt (optional): *"Create bullet points with action items"*
3. Click **Generate Summary**
4. Edit the summary as needed
5. Enter recipient emails and click **Send Email**

---

**Note**: See [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) if you encounter any issues.
