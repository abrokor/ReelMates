import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../lib/colors";

type Props = { value?: number | null };

export default function RatingBadge({ value }: Props) {
  if (value == null) return null;

  const label = Number.isFinite(value) ? value.toFixed(1) : String(value);

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
