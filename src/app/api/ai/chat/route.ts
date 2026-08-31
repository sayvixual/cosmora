import { streamText, isStepCount } from 'ai';
import { NextRequest } from 'next/server';
import { COSMORA_MODEL } from '@/lib/ai/groq-client';
import { cosmoraTools } from '@/lib/ai/tools';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Simple in-memory rate limiter (Warning: limited effectiveness in serverless functions without KV)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute
  
  const record = rateLimit.get(ip);
  if (!record || now - record.timestamp > windowMs) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= maxRequests) return true;
  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  // Encode a text chunk in the `0:"text"\n` data stream format
  const encodeText = (text: string) => encoder.encode(`0:${JSON.stringify(text)}\n`);

  // Build a human-readable error message, detecting rate-limit specifically
  const getErrorMsg = (err: unknown): string => {
    const msg = String(err);
    if (msg.includes('rate_limit') || msg.includes('Rate limit') || msg.includes('429')) {
      return '⚠️ **API rate limit reached.** Too many requests in one minute. Please wait **20–30 seconds** and try again.';
    }
    return `⚠️ Something went wrong. Please try again.`;
  };

  const body = await req.json().catch(() => null);

  if (!body?.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'messages array is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, context } = body;
  const systemPrompt = buildSystemPrompt(context);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = streamText({
          model: COSMORA_MODEL,
          system: systemPrompt,
          messages,
          tools: cosmoraTools,
          stopWhen: isStepCount(5),
        });

        for await (const chunk of result.fullStream) {
          try {
            const c = chunk as any;
            if (c.type === 'text-delta') {
              controller.enqueue(encodeText(c.text ?? ''));
            } else if (c.type === 'tool-call') {
              controller.enqueue(encodeText(`\n\n*(Memproses data menggunakan alat: ${c.toolName}...)*\n\n`));
            } else if (c.type === 'error') {
              controller.enqueue(encodeText(getErrorMsg(c.error)));
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('[COSMORA AI]', err);
        try {
          controller.enqueue(encodeText(getErrorMsg(err)));
        } catch {}
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Health check
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', model: 'openai/gpt-oss-20b' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
