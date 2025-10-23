// app/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Read from process.env (Expo injects EXPO_PUBLIC_*) and fall back to Constants.extra
const extra = (Constants.expoConfig?.extra ??
               // @ts-ignore - for older Expo Go
               Constants.manifest?.extra) as Record<string, string> | undefined;

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  extra?.EXPO_PUBLIC_SUPABASE_URL ||
  extra?.SUPABASE_URL || // fallback if you previously used this key
  '';

export const SUPABASE_ANON =
  process.env.EXPO_PUBLIC_SUPABASE_ANON ||
  extra?.EXPO_PUBLIC_SUPABASE_ANON ||
  extra?.SUPABASE_ANON || // fallback if you previously used this key
  '';

if (!SUPABASE_URL) throw new Error('Supabase URL is required. Check app.json -> extra.EXPO_PUBLIC_SUPABASE_URL');
if (!SUPABASE_ANON) throw new Error('Supabase anon key is required. Check app.json -> extra.EXPO_PUBLIC_SUPABASE_ANON');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Ensure an anonymous session exists for RLS
export async function ensureAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  }
}

export async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
