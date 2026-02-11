import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'wikiATL',
};

export default function WikiATLLayout({ children }: { children: React.ReactNode }) {
  return children;
}
