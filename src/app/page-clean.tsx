"use client";
import { useState, useRef } from "react";

type Banner = {
  type: "success" | "error";
  text: string;
} | null;

export default function Page() {
  const [transcript, setTranscript] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [subject, setSubject] = useState("Meeting Summary");
  const [recipients, setRecipients] = useState("");
  const [loadingSumm, setLoadingSumm] = useState(false);
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSummarize() {
    setBanner(null);
    setLoadingSumm(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptText: transcript, customPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to summarize");
      setSummary(data.summary || "");
    } catch (e: any) {
      setBanner({ type: "error", text: e?.message || "Summarization failed" });
    } finally {
      setLoadingSumm(false);
    }
  }

  async function handleSend() {
    setBanner(null);
    setSending(true);
    try {
      const to = recipients.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body: summary }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send email");

      if (data.failed && data.failed.length) {
        setBanner({ type: "error", text: `Some emails failed: ${data.failed.join(", ")}` });
      } else {
        setBanner({ type: "success", text: "Email sent successfully." });
      }
    } catch (e: any) {
      setBanner({ type: "error", text: e?.message || "Email sending failed" });
    } finally {
      setSending(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".txt")) {
      setBanner({ type: "error", text: "Please upload a .txt file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setTranscript(String(reader.result || ""));
    reader.onerror = () => setBanner({ type: "error", text: "Failed to read file." });
    reader.readAsText(file);
  }

  return (
    <>
      {banner && <div className={`banner ${banner.type}`}>{banner.text}</div>}

      <div className="row">
        <label>Upload .txt transcript</label>
        <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} />
      </div>

      <div className="row">
        <label>Transcript</label>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste or edit transcript..." />
      </div>

      <div className="row">
        <label>Custom instruction</label>
        <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="e.g., Summarize in 5 bullets for executives and list action items." />
      </div>

      <div className="row">
        <button onClick={handleSummarize} disabled={loadingSumm || !transcript.trim()}>
          {loadingSumm ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      <div className="row">
        <label>Summary (editable)</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary will appear here..." />
      </div>

      <div className="row">
        <label>Email subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div className="row">
        <label>Recipients (comma-separated)</label>
        <input value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="alice@example.com, bob@example.com" />
      </div>

      <div className="row">
        <button onClick={handleSend} disabled={sending || !summary.trim() || !recipients.trim()}>
          {sending ? "Sending..." : "Send Email"}
        </button>
      </div>
    </>
  );
}
