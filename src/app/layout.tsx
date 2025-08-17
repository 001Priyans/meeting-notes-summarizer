import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Meeting Notes Summarizer',
  description: 'AI-powered meeting notes summarizer and email sharer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1></h1>
          {children}
        </div>
      </body>
    </html>
  );
}
