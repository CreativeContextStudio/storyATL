'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Timeline from '@/components/layout/Timeline';
import { EASE_ATL, DURATION } from '@/lib/animations';

const navLinks = [
  { href: '/', label: 'paflDTN' },
  { href: '/brief', label: 'brief' },
  { href: '/wikiatl', label: 'wikiATL' },
  { href: '/about', label: 'about' },
] as const;

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: DURATION.base, ease: EASE_ATL },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: { duration: DURATION.slow, ease: EASE_ATL },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -8 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: DURATION.base, ease: EASE_ATL },
  }),
};

const GitHubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-text-secondary"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hideTimeline =
    pathname === '/brief' ||
    pathname === '/wikiatl' ||
    pathname === '/about' ||
    pathname.startsWith('/brief/') ||
    pathname.startsWith('/wikiatl/') ||
    pathname.startsWith('/about/');

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-[100] flex flex-col
                 border-b border-divider bg-[var(--color-header-bg)]
                 backdrop-blur-sm
                 transition-colors duration-[var(--duration-slow)] ease-atl"
    >
      <div className="flex items-center justify-between px-4 pb-1 pt-2.5 sm:px-6 sm:pb-1.5 sm:pt-3 md:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:gap-6 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[var(--color-nav-text)]
                         transition-colors hover:text-[var(--color-nav-text-hover)]"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/CreativeContextStudio/storyATL"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex h-9 w-9 items-center justify-center rounded-full
                       transition-colors duration-[var(--duration-base)] ease-atl
                       hover:bg-surface-alt"
            aria-label="View source on GitHub"
          >
            <GitHubIcon />
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full
                       transition-colors duration-[var(--duration-base)] ease-atl
                       hover:bg-surface-alt"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <div className="flex w-[18px] flex-col items-center gap-[5px]">
              <span
                className="block h-[1.5px] w-full rounded-full bg-text-secondary transition-transform duration-200"
                style={
                  mobileOpen
                    ? { transform: 'translateY(3.25px) rotate(45deg)' }
                    : undefined
                }
              />
              <span
                className="block h-[1.5px] w-full rounded-full bg-text-secondary transition-transform duration-200"
                style={
                  mobileOpen
                    ? { transform: 'translateY(-3.25px) rotate(-45deg)' }
                    : undefined
                }
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden border-t border-divider sm:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  variants={itemVariants}
                  custom={i}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium
                               text-[var(--color-nav-text)]
                               transition-colors hover:bg-surface-alt
                               hover:text-[var(--color-nav-text-hover)]"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={itemVariants}
                custom={navLinks.length}
                initial="closed"
                animate="open"
              >
                <a
                  href="https://github.com/CreativeContextStudio/storyATL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm
                             font-medium text-[var(--color-nav-text)]
                             transition-colors hover:bg-surface-alt
                             hover:text-[var(--color-nav-text-hover)]"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {!hideTimeline && (
        <div className="mx-auto w-full max-w-container">
          <Timeline />
        </div>
      )}
    </header>
  );
}
