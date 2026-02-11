import { Voice } from '@/types/exchange';
import { BRAND } from '@/lib/colors';

export const voices: Voice[] = [
  {
    id: 'marcus',
    name: 'Marcus',
    initial: 'M',
    neighborhood: 'Vine City',
    theme: 'Community care',
    excerpt:
      "We don't just live here — we hold each other up. Every porch is a meeting place, every block has its own rhythm.",
    color: BRAND.gold,
  },
  {
    id: 'linh',
    name: 'Linh',
    initial: 'L',
    neighborhood: 'Buford Highway',
    theme: 'Migration',
    excerpt:
      "My parents came here with two suitcases and a recipe. Now the whole corridor tastes like home — everyone's home.",
    color: BRAND.canopy,
  },
  {
    id: 'deja',
    name: 'Deja',
    initial: 'D',
    neighborhood: 'Old Fourth Ward',
    theme: 'Change',
    excerpt:
      'I watched them tear down the stadium. I watched them build condos. Nobody asked us what we wanted to keep.',
    color: BRAND.brick,
  },
  {
    id: 'aisha',
    name: 'Aisha',
    initial: 'A',
    neighborhood: 'Sweet Auburn',
    theme: 'Music',
    excerpt:
      'Auburn Avenue raised every sound this city ever made. Gospel on Sunday. Jazz on Friday. Trap on Tuesday.',
    color: BRAND.magenta,
  },
  {
    id: 'robert',
    name: 'Robert',
    initial: 'R',
    neighborhood: 'Old Fourth Ward',
    theme: 'Home',
    excerpt:
      "Home isn't the building — it's the corner, the tree, the sound of the train at 2 AM. You can't demolish that.",
    color: BRAND.neon,
  },
];
