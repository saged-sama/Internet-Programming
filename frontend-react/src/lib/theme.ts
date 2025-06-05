// University theme based on provided color scheme

export const theme = {
  colors: {
    // Primary colors
    primary: {
      light: '#31466F',    // Lighter navy blue
      main: '#13274D',     // Navy blue
      dark: '#0E183C',     // Darker navy blue
    },
    // Neutral colors
    neutral: {
      white: '#FFFFFF',
      lightest: '#F0F0F0',
      light: '#D3D3D3',
      medium: '#A8A8A8',
      dark: '#666666',
      darkest: '#333333',
    },
    // Accent colors
    accent: {
      yellow: {
        light: '#F5C940',  // Light gold
        main: '#ECB31D',   // Gold
        dark: '#A57700',   // Dark gold
      }
    },
    // Semantic colors
    semantic: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
    }
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    headings: {
      fontWeight: 700,
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  }
};

export default theme;
