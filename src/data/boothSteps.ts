import { BoothStep } from '@/types/exchange';

export const boothSteps: BoothStep[] = [
  {
    number: 1,
    title: 'Start',
    description: 'Walk up to the booth. Tap to begin.',
    icon: 'play',
  },
  {
    number: 2,
    title: 'Consent',
    description: 'Read and accept the terms. Your story, your rules.',
    icon: 'check',
  },
  {
    number: 3,
    title: 'Record',
    description: 'Speak your story. Up to 3 minutes.',
    icon: 'mic',
  },
  {
    number: 4,
    title: 'Title & Tags',
    description: 'Name it. Tag it with themes.',
    icon: 'tag',
  },
  {
    number: 5,
    title: 'Location',
    description: 'Drop a pin. Choose precision.',
    icon: 'pin',
  },
  {
    number: 6,
    title: 'Visibility',
    description: 'Who can see this?',
    icon: 'eye',
  },
  {
    number: 7,
    title: 'Submit',
    description: 'Done. Your story is on the map.',
    icon: 'send',
  },
];
