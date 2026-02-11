import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        'surface-dark': 'var(--color-surface-dark)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        secondary: 'var(--color-secondary)',
        'secondary-light': 'var(--color-secondary-light)',
        interactive: 'var(--color-interactive)',
        'interactive-hover': 'var(--color-interactive-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-inverse': 'var(--color-text-inverse)',
        link: 'var(--color-link)',
        'link-hover': 'var(--color-link-hover)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        highlight: 'var(--color-highlight)',
        divider: 'var(--color-divider)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Black', 'sans-serif'],
        body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'fluid-xs': 'var(--text-xs)',
        'fluid-sm': 'var(--text-sm)',
        'fluid-base': 'var(--text-base)',
        'fluid-lg': 'var(--text-lg)',
        'fluid-xl': 'var(--text-xl)',
        'fluid-2xl': 'var(--text-2xl)',
        'fluid-3xl': 'var(--text-3xl)',
        'fluid-4xl': 'var(--text-4xl)',
        'fluid-5xl': 'var(--text-5xl)',
      },
      borderRadius: {
        brand: '10px',
        'brand-sm': '6px',
        'brand-lg': '14px',
        'brand-xl': '18px',
      },
      boxShadow: {
        'brand-sm': '0 1px 2px rgba(0,0,0,0.06)',
        'brand-md': '0 4px 12px rgba(0,0,0,0.08)',
        'brand-lg': '0 8px 30px rgba(0,0,0,0.12)',
        'brand-xl': '0 20px 60px rgba(0,0,0,0.16)',
        'brand-card': '0 4px 24px rgba(0,0,0,0.10)',
        glow: 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        atl: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      maxWidth: {
        container: '1280px',
        narrow: '800px',
      },
    },
  },
  plugins: [],
};

export default config;
