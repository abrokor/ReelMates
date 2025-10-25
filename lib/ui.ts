// lib/ui.ts
export const colors = {
  // Base
  background: "#0B0E11",
  surface: "#141A20",
  surfaceDark: "#0F1419",
  card: "#1A222B",

  // Brand
  primary: "#22D3EE",            // teal
  coral: "#FF6B6B",
  textOnCoral: "#0B0E11",

  // Text
  textPrimary: "#F3F6F9",
  textSecondary: "#A7B0BA",
  text: "#F3F6F9",               // alias for convenience
  muted: "#7C8792",

  // Feedback / hairline
  danger: "#EF4444",
  success: "#10B981",
  hairline: "#2A3340",
} as const;

export const spacing = {
  xs: 4,
  s: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 36,
} as const;

export const typography = {
  display32: { fontSize: 32, fontWeight: "700" as const, color: colors.textPrimary },
  h1:        { fontSize: 24, fontWeight: "700" as const, color: colors.textPrimary },
  h2:        { fontSize: 18, fontWeight: "600" as const, color: colors.textPrimary },
  body:      { fontSize: 16, fontWeight: "400" as const, color: colors.textPrimary },
  caption12: { fontSize: 12, fontWeight: "400" as const, color: colors.textSecondary },
  button:    { fontSize: 16, fontWeight: "700" as const, color: colors.textPrimary },
} as const;
