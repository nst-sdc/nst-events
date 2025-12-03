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
};

export const THEME = {
  light: {
    background: PALETTE.creamLight,
    text: PALETTE.navyDark,
    card: PALETTE.creamDark,
    primary: PALETTE.purpleDark,
    secondary: PALETTE.purpleMedium,
    accent: PALETTE.pinkDark,
    tabBar: PALETTE.creamDark,
    tabIcon: PALETTE.purpleDeep,
    tabIconSelected: PALETTE.purpleDark,
  },
  dark: {
    background: PALETTE.navyDark,
    text: PALETTE.creamLight,
    card: PALETTE.navyLight,
    primary: PALETTE.purpleMedium,
    secondary: PALETTE.purpleLight,
    accent: PALETTE.pinkLight,
    tabBar: PALETTE.navyLight,
    tabIcon: PALETTE.pinkLight,
    tabIconSelected: PALETTE.creamLight,
  },
};

export const GRADIENTS = {
  primary: [PALETTE.purpleDark, PALETTE.purpleDeep] as const,
  secondary: [PALETTE.pinkDark, PALETTE.purpleMedium] as const,
  accent: [PALETTE.creamLight, PALETTE.creamDark] as const,
  dark: [PALETTE.navyDark, PALETTE.navyLight] as const,
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
