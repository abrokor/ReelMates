import React, { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../lib/ui";
import { imgUrl } from "../../lib/tmdb";

type RightAction = { label: string; onPress: () => void };

type Props = {
  title: string;
  subtitle?: string;
  /** pass TMDB poster_path (e.g. '/abc123.jpg') or a full URL */
  imagePath?: string | null;
  onPress?: () => void;
  /** Either a {label,onPress} action, or any ReactNode */
  right?: RightAction | React.ReactNode;
};

function MovieCardBase({ title, subtitle, imagePath, onPress, right }: Props) {
  const uri =
    imagePath && (imagePath.startsWith("http") ? imagePath : imgUrl(imagePath, "w154"));

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.left}>
        {uri ? (
          <Image source={{ uri }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.placeholder]} />
        )}

        <View style={styles.texts}>
          <Text style={typography.body} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={[typography.caption12, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.right}>
        {right && typeof right === "object" && "label" in (right as any) && "onPress" in (right as any) ? (
          <Pressable onPress={(right as RightAction).onPress} style={styles.actionBtn}>
            <Text style={[typography.button, { color: colors.primary }]}>
              {(right as RightAction).label}
            </Text>
          </Pressable>
        ) : (
          (right as React.ReactNode) ?? null
        )}
      </View>
    </Pressable>
  );
}

const MovieCard = memo(MovieCardBase);
export default MovieCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  poster: { width: 54, height: 81, borderRadius: 6, backgroundColor: colors.surface },
  placeholder: { justifyContent: "center", alignItems: "center" },
  texts: { marginLeft: spacing.md, flex: 1 },
  right: { marginLeft: spacing.md },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
  },
});
