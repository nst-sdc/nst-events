/**
 * Tekron Design System - Pure Black Edition
 * Futuristic, OLED-optimized, Neon accents.
 */

import { Platform } from 'react-native';

const tintColorLight = '#00F0FF'; // Neon Cyan
const tintColorDark = '#00F0FF'; // Neon Cyan

export const Colors = {
  light: {
    // Light mode is not the focus, but keeping it functional just in case
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    surfaceHighlight: '#E5E7EB',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    primary: '#00F0FF', // Neon Cyan
    primaryHighlight: '#E0F7FA',
    secondary: '#BF00FF', // Electric Violet
    accent: '#FF003C', // Cyber Red
    success: '#00FF9D', // Neon Green
    warning: '#FFD600', // Neon Yellow
    error: '#FF003C', // Cyber Red
    info: '#00F0FF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#FFFFFF', // High Contrast White
    textSecondary: '#CFCFCF', // Off-white/Gray
    textMuted: '#6B7280', // Muted Gray
    background: '#000000', // True Black
    surface: '#0A0A0A', // Very Dark Gray
    surfaceHighlight: '#111111', // Slightly Lighter
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    border: '#2A2A2A', // Soft Gray Border
    primary: '#00F0FF', // Neon Cyan
    primaryHighlight: 'rgba(0, 240, 255, 0.1)',
    secondary: '#BF00FF', // Electric Violet
    accent: '#FF003C', // Cyber Red
    success: '#00FF9D', // Neon Green
    warning: '#FFD600', // Neon Yellow
    error: '#FF003C', // Cyber Red
    info: '#00F0FF',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Layout = {
  radius: {
    xs: 2, // Sharp/Pixel feel
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    round: 9999,
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
    glow: {
      primary: {
        shadowColor: '#00F0FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      },
      secondary: {
        shadowColor: '#BF00FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      },
      error: {
        shadowColor: '#FF003C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Menlo', // Pixel-inspired headings
    serif: 'Georgia',
  },
  android: {
    sans: 'Roboto',
    mono: 'monospace',
    serif: 'serif',
  },
  default: {
    sans: 'System',
    mono: 'monospace',
    serif: 'serif',
  },
});

export const Typography = {
  h1: {
    fontSize: 32,
    fontFamily: Fonts.mono,
    fontWeight: '700' as const,
    letterSpacing: -1,
    color: Colors.dark.text,
  },
  h2: {
    fontSize: 24,
    fontFamily: Fonts.mono,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: Colors.dark.text,
  },
  h3: {
    fontSize: 20,
    fontFamily: Fonts.mono,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    lineHeight: 24,
    color: Colors.dark.text,
  },
  caption: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: Colors.dark.textSecondary,
  },
  button: {
    fontSize: 14,
    fontFamily: Fonts.mono,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: Colors.dark.text,
  },
};
