import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        background: '#0F172A',
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          strong: 'rgba(255, 255, 255, 0.10)',
          hover: 'rgba(255, 255, 255, 0.08)',
        },
        'card-border': {
          DEFAULT: 'rgba(255, 255, 255, 0.10)',
          strong: 'rgba(255, 255, 255, 0.18)',
        },
        'text-main': '#F8FAFC',
        'text-muted': '#94A3B8',
        ring: '#3b82f6',
        risk: {
          safe: '#10b981',
          'safe-light': 'rgba(16, 185, 129, 0.15)',
          'safe-dark': '#059669',
          caution: '#f59e0b',
          'caution-light': 'rgba(245, 158, 11, 0.15)',
          'caution-dark': '#d97706',
          danger: '#ef4444',
          'danger-light': 'rgba(239, 68, 68, 0.15)',
          'danger-dark': '#dc2626',
        },
        brand: {
          primary: '#3b82f6',
          'primary-dark': '#1d4ed8',
          secondary: '#8B5CF6',
          accent: '#8B5CF6',
          bg: '#0F172A',
          surface: 'rgba(255, 255, 255, 0.05)',
          'surface-strong': 'rgba(255, 255, 255, 0.10)',
          text: '#F8FAFC',
          'text-muted': '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        glass: '16px',
        btn: '12px',
        pill: '999px',
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.5), 0 0 10px -2px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.5), 0 0 10px -2px rgba(139, 92, 246, 0.3)',
        'glow-safe': '0 0 25px -5px rgba(16, 185, 129, 0.5), 0 0 10px -2px rgba(16, 185, 129, 0.3)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.5), 0 0 10px -2px rgba(239, 68, 68, 0.3)',
        'glow-caution': '0 0 25px -5px rgba(245, 158, 11, 0.5), 0 0 10px -2px rgba(245, 158, 11, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'glass-strong': '20px',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.6), 0 0 45px rgba(139, 92, 246, 0.4)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scanLine: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background-color': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          'background-color': 'rgba(255, 255, 255, 0.10)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
        },
      });
    }),
  ],
};
