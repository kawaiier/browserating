/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#FAFAF8',
          100: '#F5F3EE',
          200: '#F0ECE4',
          300: '#E8E4DC',
          400: '#CFC8BA',
          500: '#9A9080',
          600: '#5C5248',
          700: '#2A2520',
          800: '#252320',
          900: '#1A1A18',
          950: '#0F0E0C',
        },
        bg: {
          canvas: '#FAFAF8',
          surface: '#FFFFFF',
          'surface-subtle': '#F5F3EE',
          selected: '#FDF6D6',
        },
        text: {
          primary: '#2A2520',
          secondary: '#5C5248',
          muted: '#9A9080',
        },
        border: {
          subtle: '#E8E4DC',
          strong: '#CFC8BA',
        },
        accent: {
          primary: '#D4A800',
          'primary-hover': '#B89200',
          highlight: '#F5C400',
        },
        score: {
          excellent: '#1A8F5D',
          good: '#B89200',
          fair: '#A76A00',
          poor: '#C83A2E',
        },
        trend: {
          up: '#1A8F5D',
          flat: '#9A9080',
          down: '#C83A2E',
        },
        focus: {
          ring: '#D4A800',
        },
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        h1: ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h2: ['1.875rem', { lineHeight: '1.25' }],
        h3: ['1.5rem', { lineHeight: '1.3' }],
        h4: ['1.25rem', { lineHeight: '1.35' }],
        h5: ['1.125rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.5' }],
        overline: [
          '0.75rem',
          { lineHeight: '1.5', letterSpacing: '0.08em', textTransform: 'uppercase' },
        ],
        'metric-xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'metric-lg': ['2.25rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'metric-md': ['1.5rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '24px',
        pill: '999px',
      },
      borderWidth: {
        thin: '1px',
        thick: '2px',
      },
      boxShadow: {
        sm: '0 2px 12px rgba(0,0,0,0.06)',
        md: '0 8px 32px rgba(0,0,0,0.10)',
        lg: '0 24px 56px rgba(0,0,0,0.14)',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-out': {
          '0%': { opacity: '1' },
          '75%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-out': 'fade-out 2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
