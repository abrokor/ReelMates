// lib/screen.ts
import { colors, spacing } from "./ui";

export const screenStyles = {
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.lg,
};

// alias so either name works
export const screenStyle = screenStyles;
