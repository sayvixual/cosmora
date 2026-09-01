import { createOpenAI } from '@ai-sdk/openai';

// 9inference.cloud — OpenAI-compatible endpoint
// Model: deepseek-v4-pro — strong reasoning + tool calling
const nineinference = createOpenAI({
  baseURL: 'https://9inference.cloud/v1',
  apiKey: process.env.NINEINFERENCE_API_KEY,
});

// Primary model for COSMORA AI agent
export const COSMORA_MODEL = nineinference('deepseek-v4-pro');

// Fast model for simple queries
export const COSMORA_FAST_MODEL = nineinference('deepseek-v4-pro');

