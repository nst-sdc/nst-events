
import { Platform } from 'react-native';

const tintColorLight = '#2563EB'; // Blue-600
const tintColorDark = '#3B82F6'; // Blue-500

export const Colors = {
  light: {
    text: '#1F2937', // Gray-800
    textSecondary: '#4B5563', // Gray-600
    textMuted: '#9CA3AF', // Gray-400
    background: '#F9FAFB', // Gray-50
    surface: '#FFFFFF',
    surfaceHighlight: '#F3F4F6', // Gray-100
    tint: tintColorLight,
    icon: '#6B7280', // Gray-500
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB', // Gray-200
    primary: '#2563EB', // Blue-600
    secondary: '#10B981', // Emerald-500
    accent: '#8B5CF6', // Violet-500
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  dark: {
    text: '#F9FAFB', // Gray-50
    textSecondary: '#D1D5DB', // Gray-300
    textMuted: '#6B7280', // Gray-500
    background: '#111827', // Gray-900
    surface: '#1F2937', // Gray-800
    surfaceHighlight: '#374151', // Gray-700
    tint: tintColorDark,
    icon: '#9CA3AF', // Gray-400
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    border: '#374151', // Gray-700
    primary: '#3B82F6', // Blue-500
    secondary: '#34D399', // Emerald-400
    accent: '#A78BFA', // Violet-400
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
  },
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};

export const Layout = {
  radius: {
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
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    mono: 'monospace',
  },
});
