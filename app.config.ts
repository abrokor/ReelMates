// app.config.ts
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "ReelMates",
  slug: "reelmates",
  scheme: "reelmates",
  version: "1.0.0",
  orientation: "portrait",
  plugins: ["expo-router"],
  experiments: { typedRoutes: true },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.reelmates.app",
  },
  android: {
    package: "com.reelmates.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0F1115",
    },
  },
  web: { bundler: "metro", favicon: "./assets/favicon.png" },
  extra: {
    // Supabase (public)
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON: process.env.EXPO_PUBLIC_SUPABASE_ANON,

    // TMDB — support both v4 (preferred) and v3 (fallback)
    EXPO_PUBLIC_TMDB_READ_TOKEN: process.env.EXPO_PUBLIC_TMDB_READ_TOKEN, // v4 bearer (raw token)
    EXPO_PUBLIC_TMDB_KEY: process.env.EXPO_PUBLIC_TMDB_KEY,               // v3 key
  },
});
