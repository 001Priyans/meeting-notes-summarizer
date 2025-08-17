import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const SendEmailSchema = z.object({
  to: z.array(z.string().email()).min(1, 'At least one recipient required').max(20, 'Too many recipients'),
  subject: z.string().max(200, 'Subject too long').optional(),
  body: z.string().max(50000, 'Email body too long (max 50KB)'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle comma-separated email string
    if (typeof body.to === 'string') {
      body.to = body.to.split(',').map((email: string) => email.trim()).filter((email: string) => email.length > 0);
    }

    // Validate input
    const validation = SendEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { to, subject, body: emailBody } = validation.data;

    // Check if email body is provided
    if (!emailBody.trim()) {
      return NextResponse.json(
        { error: 'Email body is required' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmail({
      to,
      subject: subject || 'Meeting Summary',
      body: emailBody
    });

    if (result.success) {
      let message = 'Email sent successfully';
      if (result.failedRecipients && result.failedRecipients.length > 0) {
        message += `. Failed to send to: ${result.failedRecipients.join(', ')}`;
      }
      return NextResponse.json({ message, ok: true });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email', ok: false },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send email API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, ok: false },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
