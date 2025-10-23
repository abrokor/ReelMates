// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

type ExtraCfg = {
  EXPO_PUBLIC_SUPABASE_URL?: string;
  EXPO_PUBLIC_SUPABASE_ANON?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraCfg;

const url  = extra.EXPO_PUBLIC_SUPABASE_URL;
const anon = extra.EXPO_PUBLIC_SUPABASE_ANON;

if (!url || !anon) {
  throw new Error(
    `[supabase] Missing config. Got url=${String(url)}, anon=${anon ? "present" : "missing"}.
     Check .env and app.config.ts "extra".`
  );
}

export const supabase = createClient(url, anon);
