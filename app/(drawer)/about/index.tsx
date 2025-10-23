import React from "react";
import { SafeAreaView, View, Text, Pressable, Linking } from "react-native";
import { colors, spacing, typography } from "../../../lib/ui";

/**
 * About Screen
 * - No raw strings outside <Text>
 * - High-contrast, underlined support email
 * - Opens TMDB Terms in external browser
 */

export default function AboutScreen() {
  const openUrl = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
        }}
      >
        {/* Title */}
        <Text style={typography.h1}>About</Text>

        {/* App & version */}
        <View style={{ marginTop: spacing.lg }}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            App: <Text style={{ color: colors.textPrimary }}>ReelMates</Text>
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            Version: <Text style={{ color: colors.textPrimary }}>1.0.0</Text>
          </Text>
        </View>

        {/* Attribution */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={typography.h2}>Attribution</Text>

          <Text
            style={[
              typography.body,
              { marginTop: spacing.sm, color: colors.textSecondary },
            ]}
          >
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Text>

          <Pressable
            onPress={() => openUrl("https://www.themoviedb.org/terms-of-use")}
            style={{
              marginTop: spacing.md,
              borderWidth: 1,
              borderColor: colors.textSecondary,
              borderRadius: 12,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              alignItems: "center",
            }}
            accessibilityRole="button"
          >
            <Text style={[typography.body, { color: colors.textPrimary }]}>
              TMDB Terms
            </Text>
          </Pressable>
        </View>

        {/* Support */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={typography.h2}>Support</Text>

          <Text
            style={[
              typography.body,
              { marginTop: spacing.sm, color: colors.textSecondary },
            ]}
          >
            Questions or feedback? Reach out to
          </Text>

          {/* High-contrast, underlined & selectable email link */}
          <Pressable
            onPress={() => openUrl("mailto:support@reelmates.app")}
            accessibilityRole="link"
            style={{ marginTop: spacing.xs, alignSelf: "flex-start" }}
          >
            <Text
              selectable
              style={[
                typography.body,
                {
                  color: colors.textPrimary,
                  textDecorationLine: "underline",
                  fontWeight: "600",
                },
              ]}
            >
              support@reelmates.app
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
