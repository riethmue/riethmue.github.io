// tailwind.config.ts
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{ts,html,scss}'],
  darkMode: 'media', // oder 'class', falls du den Dark-Mode switchen willst
  theme: {
    extend: {
      fontFamily: {
        // NOTE: keep system fallback; you already defined Roboto in @theme
        sans: [
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
