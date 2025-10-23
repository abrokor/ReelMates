import type { TextStyle, ViewStyle } from 'react-native';
import { colors } from './colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 32, fontWeight: '800', color: colors.textPrimary },
  h2: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 16, color: colors.textPrimary },
  caption: { fontSize: 12, color: colors.textSecondary },
};

export const shadow: Record<string, ViewStyle> = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};
