import { createGroq } from '@ai-sdk/groq';

// Initialize Groq provider using Vercel AI SDK adapter
// Model: openai/gpt-oss-120b — best for tool calling + reasoning
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Primary model for COSMORA AI agent (Custom endpoint alias - Switched to 20b to avoid rate limit)
export const COSMORA_MODEL = groq('openai/gpt-oss-20b');

// Fast model for simple queries / auto-complete suggestions
export const COSMORA_FAST_MODEL = groq('openai/gpt-oss-20b');
