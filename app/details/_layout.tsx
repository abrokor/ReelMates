import React from "react";
import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";
import { colors, typography } from "../../lib/ui"; // ← two levels up

export default function DetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitle: "",
        headerLeft: () => (
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={typography.button}>Back</Text>
          </Pressable>
        ),
      }}
    />
  );
}
