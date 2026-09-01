import { createGroq } from '@ai-sdk/groq';

// Initialize Groq provider using Vercel AI SDK adapter
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Primary model — llama-3.3-70b-versatile: fast inference (~1-2s), excellent tool-calling
export const COSMORA_MODEL = groq('llama-3.3-70b-versatile');

// Fast model for simple queries / auto-complete suggestions
export const COSMORA_FAST_MODEL = groq('llama-3.1-8b-instant');
