import { GoogleGenerativeAI } from '@google/generative-ai';

interface SummarizeParams {
  transcriptText: string;
  customPrompt: string;
}

interface SummarizeResponse {
  summary: string;
}

// Initialize Google Generative AI
const genAI = process.env.GOOGLE_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) 
  : null;

const SYSTEM_PROMPT = `You are an expert meeting assistant. Produce concise, factual, and actionable summaries. Obey the custom instruction. If the transcript is empty or low-signal, return 'No substantial content found.' Do not invent details.`;

const DEFAULT_OUTPUT_STRUCTURE = `
Default output structure when user hasn't specified:

Title: <one line>

Key Points:
• <point>
• <point>
• <point>

Action Items:
• <who>: <what> by <when>
• <who>: <what> by <when>

Next Steps:
• <next meeting/follow-up>
`;

export async function summarizeMeetingNotes({ 
  transcriptText, 
  customPrompt 
}: SummarizeParams): Promise<SummarizeResponse> {
  // Validation
  if (!transcriptText?.trim()) {
    throw new Error('Transcript text is required');
  }

  if (!customPrompt?.trim()) {
    throw new Error('Custom prompt is required');
  }

  if (!genAI) {
    throw new Error('Google API key not configured. Please set GOOGLE_API_KEY in your environment variables.');
  }

  try {
    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: process.env.MODEL_ID || 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: parseFloat(process.env.MODEL_TEMPERATURE || '0.3'),
        maxOutputTokens: 2048,
      },
    });

    // Construct the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}

CUSTOM INSTRUCTION: ${customPrompt}

${DEFAULT_OUTPUT_STRUCTURE}

TRANSCRIPT TO SUMMARIZE:
${transcriptText}

Please provide a summary following the custom instruction above.`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary?.trim()) {
      return { summary: 'No substantial content found.' };
    }

    return { summary: summary.trim() };

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Google API key. Please check your GOOGLE_API_KEY configuration.');
    } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
      throw new Error('Gemini API rate limit exceeded. Please try again later.');
    } else if (error.message?.includes('SAFETY')) {
      throw new Error('Content blocked by safety filters. Please try different content.');
    } else if (error.status === 500) {
      throw new Error('Gemini API server error. Please try again later.');
    } else {
      throw new Error(`AI summarization failed: ${error.message || 'Unknown error'}`);
    }
  }
}
