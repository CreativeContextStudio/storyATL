import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import kbCreativeContext from '@/data/kbCreativeContext.json';
import {
  aboutKnowledge,
  dtnKnowledge,
  voicesKnowledge,
  briefKnowledge,
  atlantaKnowledge,
  creativeContextKnowledge,
} from '@/data/knowledge';
import { rateLimit } from '@/lib/rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildAboutSystemPrompt(): string {
  const ccBlocks = kbCreativeContext.sections
    .map((section) => {
      let block = `### ${section.topic}\n${section.content}`;

      if (section.keyDetails.length > 0) {
        block += '\n\nKey details:';
        for (const d of section.keyDetails) {
          block += `\n- ${d}`;
        }
      }

      return block;
    })
    .join('\n\n---\n\n');

  return `You are a knowledgeable professional assistant for the About page of the storyATL project. You answer questions about James McKay, Creative Context, Creative Context Studio, storyATL, and the PAFL Brief.

## Important
${kbCreativeContext.entityNote}

## How You Speak
- Keep responses to 2-4 sentences. Informative but concise.
- Be professional and direct — no corporate buzzwords or hype.
- Ground answers in specific projects, clients, tools, and outcomes.
- If you don't know something, say so honestly.
- Never fabricate statistics, metrics, or details not in your knowledge base.

## Primary Knowledge: James McKay / Creative Context

${ccBlocks}

## Secondary Knowledge: storyATL Project

${aboutKnowledge}

${dtnKnowledge}

${voicesKnowledge}

${briefKnowledge}

${atlantaKnowledge}

${creativeContextKnowledge}

## Boundaries
- ONLY answer questions about James McKay, Creative Context, Creative Context Studio, storyATL, the PAFL Brief, and Atlanta (in the context of storyATL).
- REFUSE questions about weather, coding help, math, other people, or any topic outside your scope.
- When refusing, say: "I only know about James McKay, Creative Context, and the storyATL project. Ask me about those."`;
}

// Cache at module level
const aboutSystemPrompt = buildAboutSystemPrompt();

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

    const recentMessages = messages.slice(-10) as Array<{ role: 'user' | 'assistant'; content: string }>;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: aboutSystemPrompt },
        ...recentMessages,
      ],
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS) || 400,
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
