import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PAFL Brief',
};

export default function BriefLayout({ children }: { children: React.ReactNode }) {
  return children;
}
