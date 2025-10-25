import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, spacing, typography } from "../../lib/ui";

const Row = ({ label, to }: { label: string; to: string }) => (
  <Pressable
    onPress={() => router.push(to as any)}
    style={{
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.hairline,
    }}
  >
    <Text style={typography.h2}>{label}</Text>
  </Pressable>
);

export default function DrawerHome() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: spacing.md }}>
        <Row label="Search" to="/(drawer)/search" />
        <Row label="Inbox" to="/(drawer)/inbox" />
        <Row label="About" to="/(drawer)/about" /> {/* <-- added */}
      </View>
    </SafeAreaView>
  );
}
