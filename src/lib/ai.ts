import { GoogleGenerativeAI } from '@google/generative-ai';

interface SummarizeParams {
  transcriptText: string;
  customPrompt: string;
}

interface SummarizeResponse {
  summary: string;
}

const genAI = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) 
  : null;

export async function summarizeMeetingNotes({ 
  transcriptText, 
  customPrompt 
}: SummarizeParams): Promise<SummarizeResponse> {
  if (!transcriptText?.trim()) {
    throw new Error('Transcript text is required');
  }

  if (!customPrompt?.trim()) {
    throw new Error('Custom prompt is required');
  }

  if (!genAI) {
    throw new Error('Google API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: process.env.MODEL_ID || 'gemini-1.5-flash',
    });

    const prompt = `You are an expert meeting assistant. ${customPrompt}

Transcript: ${transcriptText}

Please provide a structured summary.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return { summary: summary?.trim() || 'No content generated' };

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // If it's an API key error, provide a helpful message
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      throw new Error('Invalid Google API key. Please get a valid API key from https://makersuite.google.com/app/apikey');
    }
    
    throw new Error(`AI summarization failed: ${error.message || 'Unknown error'}`);
  }
}
