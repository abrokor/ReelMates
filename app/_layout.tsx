import React, { useEffect } from "react";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component."]);
import { Slot } from "expo-router";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  // Ensure a session exists (anonymous is fine for dev)
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          await supabase.auth.signInAnonymously();
        }
      } catch (e: any) {
        console.warn("Auth bootstrap failed:", e?.message);
      }
    })();
  }, []);

  return <Slot />;
}
