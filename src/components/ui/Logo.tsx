'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-baseline gap-0 no-underline">
      <span className="font-display text-[1.15rem] font-bold tracking-tight text-text-primary sm:text-[1.35rem]">
        story
      </span>
      <span className="font-display text-[1.15rem] font-bold tracking-tight text-accent sm:text-[1.35rem]">
        ATL
      </span>
    </Link>
  );
}
