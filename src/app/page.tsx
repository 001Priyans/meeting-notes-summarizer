'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [transcriptText, setTranscriptText] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('Meeting Summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      setError('Please upload a .txt file');
      return;
    }

    if (file.size > 200000) { // 200KB limit
      setError('File too large. Please upload a file smaller than 200KB');
      return;
    }

    try {
      const text = await file.text();
      setTranscriptText(text);
      setError('');
    } catch (err) {
      setError('Failed to read file');
    }
  };

  const generateSummary = async () => {
    if (!transcriptText.trim()) {
      setError('Please provide a transcript');
      return;
    }

    setIsGenerating(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcriptText,
          customPrompt: customPrompt || 'Provide a structured summary'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary);
      setMessage('Summary generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!summary.trim()) {
      setError('Please generate a summary first');
      return;
    }

    if (!recipients.trim()) {
      setError('Please provide recipient email addresses');
      return;
    }

    setIsSending(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipients.split(',').map(email => email.trim()).filter(email => email.length > 0),
          subject,
          body: summary
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setMessage(data.message || 'Email sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="main-container">
      <header className="page-header">
        <h1 className="page-title">AI Meeting Notes Summarizer</h1>
        <p className="page-subtitle">
          Transform your meeting transcripts into structured summaries with AI
        </p>
      </header>

      {/* Status Messages */}
      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* File Upload Section */}
      <div className="card gradient-bg">
        <div className="card-header">
          <h2 className="card-title">📁 Upload Transcript</h2>
          <p className="card-description">
            Upload a .txt file (max 200KB) or paste your transcript below
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="file-input"
          />
          {transcriptText && (
            <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              <span className="status-indicator status-ready">
                📄 File Loaded ({transcriptText.length} characters)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transcript Input */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📝 Meeting Transcript</h2>
          <p className="card-description">
            Paste or upload your meeting transcript to get started
          </p>
        </div>
        <div className="form-group">
          <textarea
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="Paste your meeting transcript here...

Example:
[10:00] John: Good morning everyone, let's start with the quarterly review...
[10:05] Sarah: The sales numbers look promising this quarter..."
            className="form-textarea xl"
          />
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎯 Custom Instructions</h2>
          <p className="card-description">
            Customize how you want your summary formatted (optional)
          </p>
        </div>
        <div className="form-group">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Examples:
• 'Summarize in bullet points for executives'
• 'Focus only on action items and deadlines'
• 'Create a summary with key decisions and next steps'
• 'Format as an agenda for the next meeting'"
            className="form-textarea"
          />
        </div>
      </div>

      {/* Generate Summary Button */}
      <div className="card">
        {transcriptText.trim() && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <span className={isGenerating ? 'status-indicator status-generating' : 'status-indicator status-ready'}>
              {isGenerating ? '🤖 AI Processing...' : '✅ Ready to Generate'}
            </span>
          </div>
        )}
        <button
          onClick={generateSummary}
          disabled={isGenerating || !transcriptText.trim()}
          className={`btn btn-primary btn-full ${isGenerating ? 'btn-loading' : ''}`}
        >
          {isGenerating ? 'Generating Summary...' : '✨ Generate AI Summary'}
        </button>
      </div>

      {/* Summary Editor */}
      {summary && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📋 Generated Summary</h2>
            <p className="card-description">
              Review and edit your AI-generated summary before sending
            </p>
          </div>
          <div className="form-group">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="form-textarea xl"
            />
          </div>
        </div>
      )}

      {/* Email Section */}
      {summary && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📧 Send via Email</h2>
            <p className="card-description">
              Share your summary with team members
            </p>
          </div>
          
          <div className="form-group">
            <label className="form-label">Recipients</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            onClick={sendEmail}
            disabled={isSending || !summary.trim() || !recipients.trim()}
            className={`btn btn-secondary btn-full ${isSending ? 'btn-loading' : ''}`}
          >
            {isSending ? 'Sending Email...' : '📤 Send Email'}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          Powered by <strong>Google Gemini AI</strong> • Built with <strong>Next.js</strong>
        </p>
        <p>
          Transform your meetings into actionable insights
        </p>
      </footer>
    </div>
  );
}
