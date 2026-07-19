import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14171F',
        'ink-soft': '#1E2230',
        paper: '#EDE7D8',
        'paper-line': '#C9BFA6',
        cloth: '#3B6255',
        gold: '#C99A3E',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-public-sans)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
