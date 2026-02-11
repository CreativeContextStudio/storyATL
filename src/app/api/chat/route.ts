import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildSystemPrompt } from '@/data/knowledge';
import { rateLimit } from '@/lib/rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache the system prompt at module level — it never changes at runtime
const systemPrompt = buildSystemPrompt();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimit(ip).limited) {
    return NextResponse.json(
      { message: "I'm getting a lot of questions right now. Give me a moment and try again." },
      { status: 429, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-key-here') {
    return NextResponse.json(
      { message: "I'm having trouble connecting right now. The API key hasn't been configured yet." },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request body.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const { messages } = body as { messages?: unknown };

    if (
      !Array.isArray(messages) ||
      !messages.every(
        (m: unknown) =>
          typeof m === 'object' &&
          m !== null &&
          typeof (m as Record<string, unknown>).role === 'string' &&
          typeof (m as Record<string, unknown>).content === 'string',
      )
    ) {
      return NextResponse.json(
        { message: 'Invalid messages format.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    // Keep only the last 10 messages for context window
    const recentMessages = messages.slice(-10) as Array<{ role: 'user' | 'assistant'; content: string }>;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages,
      ],
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS) || 300,
      temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm here, but I lost my words for a moment. Ask me again.";

    return NextResponse.json({ message: reply }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    const status = (error as { status?: number }).status;

    if (status === 401) {
      return NextResponse.json(
        { message: "I'm having trouble connecting right now. There's an authentication issue on my end." },
        { status: 401, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (status === 429) {
      return NextResponse.json(
        { message: "I'm getting a lot of questions right now. Give me a moment and try again." },
        { status: 429, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return NextResponse.json(
      { message: "I'm having trouble connecting right now. Try again in a moment." },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
