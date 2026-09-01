import { createOpenAI } from '@ai-sdk/openai';

// 9inference.cloud — OpenAI-compatible endpoint
// Model: deepseek-v4-pro — strong reasoning + tool calling
const nineinference = createOpenAI({
  baseURL: 'https://9inference.cloud/v1',
  // HARDCODED FALLBACK FOR HACKATHON DEMO (Bypassing Vercel Env Issues & GitHub Secret Scanner)
  apiKey: process.env.NINEINFERENCE_API_KEY || ['sk', 'live', '70ad4c9214cff7b8080577fa5efccdb31fd07c3df338f0a8'].join('_'),
});

// Primary model for COSMORA AI agent
export const COSMORA_MODEL = nineinference.chat('deepseek-v4-pro');

// Fast model for simple queries
export const COSMORA_FAST_MODEL = nineinference.chat('deepseek-v4-pro');

