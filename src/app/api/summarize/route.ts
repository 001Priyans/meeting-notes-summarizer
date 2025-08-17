import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { summarizeMeetingNotes } from '@/lib/ai';

const SummarizeSchema = z.object({
  transcriptText: z.string().max(200000, 'Transcript too long (max 200KB)'),
  customPrompt: z.string().max(2000, 'Custom prompt too long (max 2KB)'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = SummarizeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { transcriptText, customPrompt } = validation.data;

    // Check if transcript is provided
    if (!transcriptText.trim()) {
      return NextResponse.json(
        { error: 'Transcript text is required' },
        { status: 400 }
      );
    }

    // Generate summary
    const result = await summarizeMeetingNotes({
      transcriptText,
      customPrompt: customPrompt || 'Provide a structured summary'
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Summarize API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
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
