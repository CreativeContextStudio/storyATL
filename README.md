# storyATL

**A living archive where Atlanta tells its own stories.**

storyATL is a guided conversational experience that introduces visitors to a city-scale public storytelling platform. Residents record personal stories at physical booths, tag and map them to neighborhoods, and at night those stories are projected onto building facades across Atlanta.

Built as the interactive application for a 2026 [Public Art Futures Lab](https://publicartfutureslab.org) (PAFL) proposal by [Creative Context](https://creativecontext.studio).

## The Experience

The main app walks visitors through 10 exchanges — a conversation with Atlanta itself. Exchanges 0–8 are pre-scripted with animated typing. Exchange 9 opens a live AI chat where visitors can ask anything about the project, the city, or the people behind it.

| # | Exchange | What Happens |
|---|----------|--------------|
| 0 | **Welcome** | Opening prompt — "Tell me a story that could only happen here" |
| 1 | **City** | What storyATL is — a living archive |
| 2 | **Voices** | Five storytellers across five Atlanta neighborhoods |
| 3 | **Booth** | The 7-step recording process |
| 4 | **Shield** | Privacy controls and storyteller protections |
| 5 | **Map** | Interactive neighborhood map with pins, filters, and MARTA lines |
| 6 | **View** | Projection mapping, gesture interaction, public screens |
| 7 | **Builder** | Creative Context and the team |
| 8 | **Plan** | Six phases over 18 weeks |
| 9 | **Chat** | Live AI conversation with "Atlanta" (OpenAI) |

### Additional Pages

- **`/about`** — Interactive chatbot about James McKay and Creative Context, with 65+ suggested questions across career, AI, skills, and philosophy
- **`/brief`** — Full PAFL 2026 application brief with anchor navigation, tech stack tables, MVP data model, and community engagement plan
- **`/wikiatl`** — Atlanta history chatbot with 64 suggested questions spanning neighborhoods, people, events, and transit — powered by a curated knowledge base from pre-colonial era to present

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key (for live chat features)

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env.local
```

Add your key to `.env.local`:

```
OPENAI_API_KEY=sk-your-key-here
```

> `.env.local` is in `.gitignore` — never commit it.

Optional configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_MODEL` | `gpt-4o-mini` | Model for all chat endpoints |
| `OPENAI_MAX_TOKENS` | `300` | Max response tokens |
| `OPENAI_TEMPERATURE` | `0.7` | Response creativity (0–2) |

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

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI | React 18, TypeScript 5 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Animation | Framer Motion 11 |
| AI | OpenAI SDK (gpt-4o-mini) |
| Utilities | clsx + tailwind-merge |

## Architecture

### Two-Column Layout

Desktop: a sticky visual panel (left 45%) paired with a scrollable chat thread (right 55%). On mobile, the visual panel is hidden and inline visuals appear within the scroll thread.

### State Management

A single `useReducer`-based context (`StoryContext`) manages exchange progression, message history, theme, and typing state. No external state libraries.

### Exchange-Driven Flow

The `Exchange` array in `src/data/exchanges.ts` is the core data model. Each exchange defines a pre-scripted question/response pair, an optional embedded component (`VoiceProfiles`, `BoothSteps`, `ShieldList`, `PlanPhases`), and visual metadata for the left panel. The `useExchangeNavigation` hook orchestrates suggestion clicks, auto-typing animations, and exchange advancement.

### Three AI Chat Endpoints

| Endpoint | Persona | Knowledge Base |
|----------|---------|---------------|
| `/api/chat` | Atlanta the city, personified | 6 knowledge modules (storyATL, Atlanta, voices, brief, Creative Context, ATL DTN) |
| `/api/about-chat` | Professional assistant | Creative Context portfolio, James McKay bio |
| `/api/wiki` | Atlanta history guide | Curated history database (eras, events, people, places) |

All endpoints include in-memory rate limiting (20 req/min per IP) and input validation.

### Theme System

Light and dark themes use CSS custom properties on `<html data-theme="light|dark">` — not Tailwind's `dark:` prefix. Variables defined in `globals.css` are mapped to Tailwind utilities in `tailwind.config.ts`. Theme persists to `localStorage`.

| | Light | Dark |
|---|-------|------|
| Surface | Dawn `#FFF8F5` | Sunpaper `#F5F2ED` |
| Accent | Neon `#FF7F5C` | Canopy `#165B4A` |

### Typography

Three fonts loaded via `next/font/google` with a fluid type scale (`clamp()`-based, `--text-xs` through `--text-5xl`):

- **Space Grotesk** — headings
- **DM Sans** — body text
- **JetBrains Mono** — code

### Animation

Framer Motion variants (`fadeIn`, `fadeScale`, `slideUp`, `staggerContainer`, `messageEntrance`, `bounceEntrance`) with a custom brand easing curve. Auto-typing animation for visitor messages. `AnimatePresence` transitions between visual panels. Scroll-triggered entrance animations on the brief page.

## Project Structure

```
src/
  app/
    api/chat/          # Exchange 9 live chat
    api/about-chat/    # About page chatbot
    api/wiki/          # Atlanta history chatbot
    about/             # About page
    brief/             # PAFL application brief
    wikiatl/           # Atlanta history chat
    layout.tsx         # Root layout, fonts, providers
    globals.css        # Theme variables, fluid type scale
    page.tsx           # Main guided conversation
  components/
    chat/              # ChatThread, ChatMessage, suggestion flow, embedded data
    visuals/           # Left-panel visual per exchange (10 components)
    layout/            # Header, Timeline, Footer, SiteFooter
    ui/                # ThemeToggle, Logo, Wordmark
  context/             # StoryContext (useReducer)
  hooks/               # useAutoType, useExchangeNavigation, useScrollVisualSync
  data/                # Exchanges, voices, booth steps, phases
    knowledge/         # AI knowledge base modules
  lib/                 # cn(), animations, colors, rate-limit
  types/               # TypeScript interfaces
```

## License

All rights reserved. This project is proprietary to [Creative Context](https://creativecontext.studio).

---

Built in Atlanta by [Creative Context](https://creativecontext.studio).
