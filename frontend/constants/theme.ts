import { TextStyle } from 'react-native';

export const PALETTE = {
  // Primary Colors
  primaryBlue: "#0052FF",           // Bright Newton Blue - Primary CTA
  primaryOrange: "#FFA500",         // Newton's Gold/Orange - Highlights
  primaryMint: "#4FD1C5",           // Newton's Mint Green - Success/Active

  // Blue Palette
  blueLight: "#E3F2FD",
  blueSuperLight: "#BBDEFB",
  blueMedium: "#90CAF9",
  blueDark: "#003D99",

  // Orange Palette
  orangeLight: "#FFE4CC",
  orangeMedium: "#FF9933",
  orangeDark: "#FF7F50",

  // Mint Palette
  mintLight: "#E0F7F4",
  mintMedium: "#4FD1C5",
  mintDark: "#2DB5A0",

  // Neutrals
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  mediumGray: "#CCCCCC",
  darkGray: "#333333",
  black: "#000000",

  // Status
  alertRed: "#D32F2F",
  redDark: "#B71C1C",
  successGreen: "#4FD1C5",
  warningOrange: "#FFA500",

  // Backgrounds
  bgSuperLight: "#F9FAFB",
  bgLight: "#FFFFFF",
  // Extended Palette
  navyDark: "#0B1D38",
  navyLight: "#1A2E4F",
  pinkLight: "#FFC2E2",
  pinkDark: "#C2185B",
  yellowLight: "#FFF9C4",
  gray: "#9E9E9E",
  purpleLight: "#E0E0FF",
  purpleMedium: "#8A2BE2",
  purpleDeep: "#4B0082",
  creamLight: "#FFFDD0",
  creamDark: "#F0E68C",
};

export const GRADIENTS = {
  primary: [PALETTE.primaryBlue, PALETTE.blueDark] as const,
  success: [PALETTE.mintMedium, PALETTE.mintDark] as const,
  warning: [PALETTE.primaryOrange, PALETTE.orangeDark] as const,
  error: [PALETTE.alertRed, PALETTE.redDark] as const,

  // Component specific
  header: [PALETTE.primaryBlue, PALETTE.blueDark] as const,
  lightBlue: [PALETTE.blueLight, PALETTE.blueSuperLight] as const,
  bgSoft: [PALETTE.white, PALETTE.lightGray] as const,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: "#0066FF", // Blue-tinted shadow for premium feel
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  }
};

export const THEME = {
  light: {
    background: PALETTE.bgLight,
    text: PALETTE.darkGray,
    card: PALETTE.white,
    primary: PALETTE.primaryBlue,
    secondary: PALETTE.primaryMint,
    accent: PALETTE.primaryOrange,
    tabBar: PALETTE.white,
    tabIcon: PALETTE.darkGray,
    tabIconSelected: PALETTE.primaryBlue,
  },
  dark: {
    background: PALETTE.bgLight, // Force light theme for consistency with Newton brand
    text: PALETTE.darkGray,
    card: PALETTE.white,
    primary: PALETTE.primaryBlue,
    secondary: PALETTE.primaryMint,
    accent: PALETTE.primaryOrange,
    tabBar: PALETTE.white,
    tabIcon: PALETTE.darkGray,
    tabIconSelected: PALETTE.primaryBlue,
  },
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
  h1: { fontSize: 32, fontFamily: 'Orbitron_700Bold', fontWeight: 'bold' as TextStyle['fontWeight'] },
  h2: { fontSize: 24, fontFamily: 'Orbitron_600SemiBold', fontWeight: 'bold' as TextStyle['fontWeight'] },
  h3: { fontSize: 20, fontFamily: 'Orbitron_500Medium', fontWeight: '600' as TextStyle['fontWeight'] },
  h4: { fontSize: 18, fontFamily: 'Orbitron_500Medium', fontWeight: '600' as TextStyle['fontWeight'] },
  body: { fontSize: 16, fontFamily: 'Inter_400Regular', fontWeight: 'normal' as TextStyle['fontWeight'] },
  caption: { fontSize: 12, fontFamily: 'Inter_400Regular', fontWeight: 'normal' as TextStyle['fontWeight'] },
};
