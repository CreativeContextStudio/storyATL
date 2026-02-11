# storyATL

**A living archive where Atlanta tells its own stories.**

storyATL is a guided conversational experience that introduces visitors to a city-scale public storytelling platform. Residents record personal stories at physical booths, tag and map them to neighborhoods, and at night those stories are projected onto building facades across Atlanta.

This repository is the interactive application for a 2026 Public Art Futures Lab (PAFL) proposal by [Creative Context](https://creativecontext.studio).

## The Experience

The app walks visitors through 10 exchanges — a conversation with Atlanta itself:

| # | Exchange | What it covers |
|---|----------|---------------|
| 0 | **Welcome** | Opening prompt |
| 1 | **City** | What storyATL is |
| 2 | **Voices** | Five storytellers from five neighborhoods |
| 3 | **Booth** | The 7-step recording process |
| 4 | **Shield** | Privacy and storyteller protections |
| 5 | **Map** | The interactive neighborhood map |
| 6 | **Night** | Projection mapping and public display |
| 7 | **Builder** | Creative Context and the team |
| 8 | **Plan** | Six phases over 18 weeks |
| 9 | **Chat** | Live AI conversation with "Atlanta" |

Exchanges 0–8 are pre-scripted with animated typing. Exchange 9 is a live chat powered by OpenAI, where visitors can ask anything about the project, the city, or the people building it.

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key (for Exchange 9 live chat)

### Install

```bash
npm install
```

### Environment

Copy the example and add your key:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

> **Never commit `.env.local`.** It is already in `.gitignore`.

Optional environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `OPENAI_MAX_TOKENS` | `300` | Max response tokens |
| `OPENAI_TEMPERATURE` | `0.7` | Response creativity |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## Tech Stack

- **Next.js 14** (App Router) — framework
- **React 18** — UI
- **TypeScript 5** — type safety
- **Tailwind CSS 3.4** — styling via CSS custom properties
- **Framer Motion 11** — animations and transitions
- **OpenAI SDK** — live chat (Exchange 9)

## Project Structure

```
src/
  app/
    api/chat/     # POST — OpenAI chat for Exchange 9
    api/wiki/     # POST — OpenAI chat for atlWiki history guide
    about/        # About page
    atlwiki/      # atlWiki — standalone Atlanta history chat
    brief/        # Project brief page
    layout.tsx    # Root layout, fonts, providers
    globals.css   # Theme variables, fluid type scale
    page.tsx      # Main guided conversation
  components/
    chat/         # ChatThread, ChatMessage, suggestion flow, embedded data components
    visuals/      # Left-panel scene components (one per exchange)
    layout/       # Header, Timeline, Footer
    ui/           # ThemeToggle, Logo
  context/        # StoryContext (useReducer state management)
  hooks/          # useAutoType, useExchangeNavigation
  data/           # Exchange definitions, voices, phases, knowledge base
  lib/            # Utilities (cn, animations)
  types/          # TypeScript interfaces
```

## Layout

Two-column design on desktop:

- **Left (45%)** — Sticky visual panel that changes with each exchange
- **Right (55%)** — Scrollable chat thread with animated message bubbles

On mobile, only the chat thread is shown.

## Theming

Light and dark themes controlled via `data-theme` attribute on `<html>`. All colors use CSS custom properties (`--color-*`) defined in `globals.css`, mapped to Tailwind utilities in `tailwind.config.ts`. Theme preference persists to `localStorage`.

---

Built by [Creative Context](https://creativecontext.studio) in Atlanta.
