import { TextStyle } from 'react-native';

export const PALETTE = {
  creamLight: '#F7E8A4',
  yellowLight: '#F7E8A4',
  creamDark: '#EBD0AA',
  pinkLight: '#D9A8BD',
  pinkMedium: '#CF96B5',
  pinkDark: '#C68AC8',
  purpleLight: '#B572D0',
  purpleMedium: '#8A5CC2',
  purpleDark: '#5B47A4',
  purpleDeep: '#3E3A7E',
  navyLight: '#2F345C',
  navyDark: '#1C2044',

  // New Design System
  primaryPurple: '#A06BFF',
  primaryPurpleDeep: '#8B4DFF',
  primaryDarkBase: '#0C0E23',
  accentCyan: '#6BAAB3',
  accentOrange: '#DC7C69',
  bgDeepNight: '#151A3A',
  bgLavenderCloud: '#8D7ADB',
  uiWhite: '#F0E4FF',
  textSoftLavender: '#DCD8FF',
  textMuted: '#9A8ACF',
  borderDefault: '#1A112B',
  bgPanel: '#151A3A',
};

export const THEME = {
  light: {
    background: PALETTE.creamLight,
    text: PALETTE.navyDark,
    card: PALETTE.creamDark,
    primary: PALETTE.primaryPurple, // Updated to match brand
    secondary: PALETTE.primaryPurpleDeep, // Updated to match brand
    accent: PALETTE.accentOrange, // Updated
    tabBar: PALETTE.creamDark,
    tabIcon: PALETTE.purpleDeep,
    tabIconSelected: PALETTE.primaryPurple,
  },
  dark: {
    background: PALETTE.primaryDarkBase,
    text: PALETTE.uiWhite,
    card: PALETTE.bgPanel,
    primary: PALETTE.primaryPurple,
    secondary: PALETTE.primaryPurpleDeep,
    accent: PALETTE.accentCyan,
    tabBar: PALETTE.bgDeepNight,
    tabIcon: PALETTE.textMuted,
    tabIconSelected: PALETTE.primaryPurple,
  },
};

export const GRADIENTS = {
  primary: [PALETTE.primaryPurple, PALETTE.primaryPurpleDeep] as const,
  secondary: [PALETTE.accentCyan, PALETTE.primaryPurple] as const,
  accent: [PALETTE.accentOrange, PALETTE.pinkLight] as const,
  dark: [PALETTE.primaryDarkBase, PALETTE.bgDeepNight] as const,
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  round: 9999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' as TextStyle['fontWeight'] },
  h2: { fontSize: 24, fontWeight: 'bold' as TextStyle['fontWeight'] },
  h3: { fontSize: 20, fontWeight: '600' as TextStyle['fontWeight'] },
  h4: { fontSize: 18, fontWeight: '600' as TextStyle['fontWeight'] },
  body: { fontSize: 16, fontWeight: 'normal' as TextStyle['fontWeight'] },
  caption: { fontSize: 12, fontWeight: 'normal' as TextStyle['fontWeight'] },
};
