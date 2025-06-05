import { theme } from './theme';

// Helper functions to access theme values in className strings
export const getThemeColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    if (value && value[key]) {
      value = value[key];
    } else {
      console.warn(`Theme color path not found: ${path}`);
      return '';
    }
  }
  
  return value;
};

// Common class names for theme colors
export const themeClasses = {
  // Background colors
  bgPrimary: `bg-[${theme.colors.primary.main}]`,
  bgPrimaryLight: `bg-[${theme.colors.primary.light}]`,
  bgPrimaryDark: `bg-[${theme.colors.primary.dark}]`,
  bgAccentYellow: `bg-[${theme.colors.accent.yellow.main}]`,
  bgAccentYellowLight: `bg-[${theme.colors.accent.yellow.light}]`,
  bgAccentYellowDark: `bg-[${theme.colors.accent.yellow.dark}]`,
  
  // Text colors
  textPrimary: `text-[${theme.colors.primary.main}]`,
  textPrimaryLight: `text-[${theme.colors.primary.light}]`,
  textAccentYellow: `text-[${theme.colors.accent.yellow.main}]`,
  textAccentYellowLight: `text-[${theme.colors.accent.yellow.light}]`,
  
  // Border colors
  borderPrimary: `border-[${theme.colors.primary.main}]`,
  borderAccentYellow: `border-[${theme.colors.accent.yellow.main}]`,
  
  // Hover states
  hoverBgAccentYellow: `hover:bg-[${theme.colors.accent.yellow.main}]`,
  hoverBgAccentYellowLight: `hover:bg-[${theme.colors.accent.yellow.light}]`,
  hoverTextPrimary: `hover:text-[${theme.colors.primary.main}]`,
  hoverBorderAccentYellow: `hover:border-[${theme.colors.accent.yellow.main}]`,
  
  // Combined classes for common UI elements
  primaryButton: `bg-[${theme.colors.accent.yellow.main}] hover:bg-[${theme.colors.accent.yellow.light}] text-[${theme.colors.primary.main}]`,
  outlineButton: `border-[${theme.colors.accent.yellow.main}] text-[${theme.colors.accent.yellow.main}] hover:bg-[${theme.colors.accent.yellow.main}] hover:text-[${theme.colors.primary.main}]`,
  navLink: `text-white hover:border-[${theme.colors.accent.yellow.main}] hover:text-[${theme.colors.accent.yellow.light}]`,
  
  // Gradient backgrounds
  primaryGradient: `bg-gradient-to-r from-[${theme.colors.primary.main}] to-[${theme.colors.primary.light}]`,
};

// For use in styled components or other JS contexts
export const themeValues = {
  colors: {
    primary: theme.colors.primary.main,
    primaryLight: theme.colors.primary.light,
    primaryDark: theme.colors.primary.dark,
    accentYellow: theme.colors.accent.yellow.main,
    accentYellowLight: theme.colors.accent.yellow.light,
    accentYellowDark: theme.colors.accent.yellow.dark,
  },
  spacing: theme.spacing,
  borderRadius: theme.borderRadius,
};

export default themeClasses;
