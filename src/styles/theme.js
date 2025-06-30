import { COLORS } from './GlobalStyles';  

export const lightTheme = {
  mode: 'light',
  primary: COLORS.primaryGreen,
  primaryMuted: COLORS.lightGreen,
  accent: COLORS.accentBlue,
  success: COLORS.lightGreen,
  error: '#C62828',

  background: COLORS.white,
  card: COLORS.lightGray,
  inputBackground: COLORS.white,
  surface: '#F9F9F9',

  text: COLORS.darkText,
  white: COLORS.white,
  disabled: COLORS.mediumGray,
  border: COLORS.mediumGray,

  icon: '#212121',
};

export const darkTheme = {
  mode: 'dark',
  primary: COLORS.primaryGreen,
  primaryMuted: COLORS.darkGreen,
  accent: COLORS.accentBlue,
  success: COLORS.lightGreen,
  error: '#EF5350',

  background: '#121212',
  card: '#1E1E1E',
  inputBackground: '#1C1C1C',
  surface: '#262626',

  text: COLORS.white,
  white: COLORS.white,
  disabled: '#555555',
  border: '#3E3E3E',

  icon: '#FFFFFF',
};
