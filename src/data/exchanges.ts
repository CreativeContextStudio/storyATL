import { Exchange } from '@/types/exchange';

export const exchanges: Exchange[] = [
  {
    id: 0,
    slug: 'welcome',
    title: 'Atlanta Welcome',
    label: 'Welcome',
    visitorQuestion: '',
    atlantaResponse: 'Ask Atlanta a question.',
    suggestion: 'Tell me a story that could only happen here.',
    visualMeta: {
      title: 'Atlanta Welcome',
      subtitle: 'A city of stories',
      stat: 'RECORD. TAG. TELL STORIES.',
    },
  },
  {
    id: 1,
    slug: 'city',
    title: 'The City',
    label: 'City',
    visitorQuestion: 'Tell me a story that could only happen here.',
    atlantaResponse:
      'This is storyATL — a living archive where Atlanta tells its own stories. Every story is an Atlanta voice. Every voice has a place. Record. Tag. Tell Stories.',
    suggestion: 'Who is telling these stories?',
    visualMeta: {
      title: 'The City',
      subtitle: 'A living archive',
      stat: 'RECORD. TAG. TELL STORIES.',
    },
  },
  {
    id: 2,
    slug: 'voices',
    title: 'The Voices',
    label: 'Voices',
    visitorQuestion: 'Who is telling these stories?',
    atlantaResponse: 'Everyone.',
    suggestion: 'How does it work?',
    component: 'VoiceProfiles',
    visualMeta: {
      title: 'The Voices',
      subtitle: 'Who talks?',
      stat: '5 VOICES ACROSS 5 NEIGHBORHOODS',
    },
  },
  {
    id: 3,
    slug: 'booth',
    title: 'The Booth',
    label: 'Booth',
    visitorQuestion: 'How does it work?',
    atlantaResponse:
      'Seven steps. Walk up, consent, record your story, title and tag it, drop a pin, choose who sees it, submit. The booth handles the rest.',
    suggestion: 'What protects the stories and storytellers?',
    component: 'BoothSteps',
    visualMeta: {
      title: 'The Booth',
      subtitle: 'How does it work?',
      stat: '7 STEPS FROM STORY TO MAP PIN',
    },
  },
  {
    id: 4,
    slug: 'shield',
    title: 'The Shield',
    label: 'Shield',
    visitorQuestion: 'What protects the stories and storytellers?',
    atlantaResponse:
      'The storytellers do.\nThey decide who can see a story: everyone, their community, or just them.\nThey decide how precise the location is: exact spot, rough area, neighborhood, or hidden.\nThey decide how they\'re credited: name, pseudonym, or anonymous.\nGuardrails filter harmful content before it posts.\nAnd they can edit or remove their story anytime.',
    suggestion: 'Show me the interactive map.',
    component: 'ShieldList',
    visualMeta: {
      title: 'The Shield',
      subtitle: 'What protects the stories?',
      stat: '',
    },
  },
  {
    id: 5,
    slug: 'map',
    title: 'The Map',
    label: 'Map',
    visitorQuestion: 'Show me the interactive map.',
    atlantaResponse:
      'Every story, every voice, every place. Pins cluster by neighborhood. Filter by theme, date, or walk. Toggle MARTA lines to see transit connections. Click any pin to hear a preview.',
    suggestion: 'How do we see these stories?',
    visualMeta: {
      title: 'The Map',
      subtitle: 'Every story has a place',
      stat: 'EVERY PIN IS A VOICE',
    },
  },
  {
    id: 6,
    slug: 'night',
    title: 'The View',
    label: 'View',
    visitorQuestion: 'How do we see these stories?',
    atlantaResponse:
      'Stories leave the app and find public screens and projections. Booths at events have displays with generated stories. Projection mapping turns facades into living narratives — text scrolling across a wall, voices echoing off concrete. Gesture recognition lets passersby interact with projected stories using their bodies and hands.',
    suggestion: 'Who builds this?',
    visualMeta: {
      title: 'The View',
      subtitle: 'Stories leave the screen',
      stat: 'PROJECTION MAPPING + GESTURE',
    },
  },
  {
    id: 7,
    slug: 'builder',
    title: 'The Builder',
    label: 'Builder',
    visitorQuestion: 'Who builds this?',
    atlantaResponse:
      'James McKay, through Creative Context — a practice at the intersection of design, technology, and public storytelling. Based in Atlanta. Building tools that make communities visible, not just heard. This project is a 2026 PAFL application — Public Art Futures Lab.',
    suggestion: "What's the plan?",
    visualMeta: {
      title: 'The Builder',
      subtitle: 'Creative Context',
      stat: 'DESIGN + TECHNOLOGY + PUBLIC STORYTELLING',
    },
  },
  {
    id: 8,
    slug: 'plan',
    title: 'The Plan',
    label: 'Plan',
    visitorQuestion: "What's the plan?",
    atlantaResponse: 'Six phases.',
    suggestion: "It's my turn.",
    component: 'PlanPhases',
    visualMeta: {
      title: 'The Plan',
      subtitle: "What's the plan?",
      stat: '18 WEEKS, 6 PHASES',
    },
  },
  {
    id: 9,
    slug: 'voice',
    title: 'The Chat',
    label: 'Chat',
    visitorQuestion: '',
    atlantaResponse:
      "Now it's your turn. Ask me anything about storyATL, Atlanta, Creative Context. I'm listening.",
    visualMeta: {
      title: 'The Chat',
      subtitle: 'Your turn',
      stat: '10 EXCHANGES | 5 VOICES | 25+ NEIGHBORHOODS',
    },
  },
];

export const exchangeLabels = exchanges.map((e) => e.label);
