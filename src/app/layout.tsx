import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { StoryProvider } from '@/context/StoryContext';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#F5F2ED' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://storyatl.creativecontext.studio'),
  title: {
    default: 'storyATL — Atlanta tells its own stories',
    template: '%s | storyATL',
  },
  description:
    'A living archive where Atlanta voices are recorded, tagged, mapped, and projected onto public spaces. A 2026 PAFL application by Creative Context.',
  openGraph: {
    title: 'storyATL — Atlanta tells its own stories',
    description:
      'A living archive where Atlanta voices are recorded, tagged, mapped, and projected onto public spaces.',
    url: 'https://storyatl.creativecontext.studio',
    siteName: 'storyATL',
    locale: 'en_US',
    type: 'website',
    // images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'storyATL — Atlanta tells its own stories',
    description:
      'A living archive where Atlanta voices are recorded, tagged, mapped, and projected onto public spaces.',
    // images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <StoryProvider>
          <div className="flex h-screen overflow-hidden flex-col bg-surface transition-colors duration-[var(--duration-slow)] ease-atl">
            {children}
          </div>
        </StoryProvider>
      </body>
    </html>
  );
}
