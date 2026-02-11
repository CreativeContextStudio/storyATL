'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Timeline from '@/components/layout/Timeline';

export default function Header() {
  const pathname = usePathname();
  const hideTimeline =
    pathname === '/brief' ||
    pathname === '/wikiatl' ||
    pathname === '/about' ||
    pathname.startsWith('/brief/') ||
    pathname.startsWith('/wikiatl/') ||
    pathname.startsWith('/about/');

  return (
    <header
      className="sticky top-0 z-[100] flex flex-col
                 border-b border-divider bg-[var(--color-header-bg)]
                 backdrop-blur-sm
                 transition-colors duration-[var(--duration-slow)] ease-atl"
    >
      <div className="flex items-center justify-between px-4 pb-1 pt-2.5 sm:px-6 sm:pb-1.5 sm:pt-3 md:px-8">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <Link
            href="/"
            className="text-xs font-medium text-[var(--color-nav-text)] sm:text-sm
                       transition-colors hover:text-[var(--color-nav-text-hover)]"
          >
            paflDTN
          </Link>
          <Link
            href="/brief"
            className="hidden text-sm font-medium text-[var(--color-nav-text)] sm:inline
                       transition-colors hover:text-[var(--color-nav-text-hover)]"
          >
            brief
          </Link>
          <Link
            href="/wikiatl"
            className="hidden text-sm font-medium text-[var(--color-nav-text)] sm:inline
                       transition-colors hover:text-[var(--color-nav-text-hover)]"
          >
            wikiATL
          </Link>
          <Link
            href="/about"
            className="text-xs font-medium text-[var(--color-nav-text)] sm:text-sm
                       transition-colors hover:text-[var(--color-nav-text-hover)]"
          >
            about
          </Link>
          <ThemeToggle />
        </nav>
      </div>
      {!hideTimeline && (
        <div className="mx-auto w-full max-w-container">
          <Timeline />
        </div>
      )}
    </header>
  );
}
