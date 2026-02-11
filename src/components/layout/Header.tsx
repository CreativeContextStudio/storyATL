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
          <a
            href="https://github.com/CreativeContextStudio/storyATL"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-9 w-9 items-center justify-center rounded-full
                       transition-colors duration-[var(--duration-base)] ease-atl
                       hover:bg-surface-alt"
            aria-label="View source on GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-text-secondary"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
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
