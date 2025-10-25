import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, spacing, typography } from "../../lib/ui";
import { screenStyles } from "../../lib/screen";
import { imgUrl, MediaType } from "../../lib/tmdb";
import RatingBadge from "../../components/RatingBadge";
import { supabase } from "../../lib/supabase";

type SavedRow = {
  id: string;
  media: MediaType;
  tmdb_id: number;
  title: string | null;
  poster_path: string | null;
  rating: number | null;
};

export default function InboxScreen() {
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<SavedRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("saved_items")
        .select("id, media, tmdb_id, title, poster_path, rating")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setRows(data ?? []);
    } catch (e: any) {
      setRows([]);
      setError(e?.message ?? "Failed to load Inbox");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    setBusy(true);
    try {
      const { error: err } = await supabase.from("saved_items").delete().eq("id", id);
      if (err) throw err;
      setRows((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusy(false);
    }
  }

  function open(row: SavedRow) {
    router.push(`/details/${row.media}/${row.tmdb_id}`);
  }

  function renderItem({ item }: { item: SavedRow }) {
    const posterUri = item.poster_path ? { uri: imgUrl(item.poster_path, "w185") } : undefined;

    return (
      <Pressable
        onPress={() => open(item)}
        style={{
          flexDirection: "row",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 80,
            height: 120,
            borderRadius: 8,
            backgroundColor: colors.card,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {posterUri ? (
            <Image source={posterUri} style={{ width: 80, height: 120 }} resizeMode="cover" />
          ) : (
            <Text style={[typography.caption12, { color: colors.muted }]}>No Poster</Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={typography.body} numberOfLines={2}>
            {item.title ?? "Untitled"}
          </Text>
        </View>

        {item.rating ? <RatingBadge value={item.rating} /> : null}

        <Pressable
          onPress={() => remove(item.id)}
          style={{
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.md,
            borderRadius: 8,
            backgroundColor: colors.card,
            marginLeft: spacing.md,
          }}
        >
          <Text style={typography.caption12}>Remove</Text>
        </Pressable>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={screenStyles.container}>
      {busy && rows.length === 0 ? (
        <ActivityIndicator style={{ marginTop: spacing.lg }} />
      ) : error ? (
        <Text style={[typography.body, { color: colors.danger, margin: spacing.lg }]}>{error}</Text>
      ) : rows.length === 0 ? (
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
          <Text style={typography.h1}>Inbox is empty</Text>
          <Text style={[typography.body, { marginTop: spacing.sm, color: colors.muted }]}>
            Save a movie or show from Search to see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.hairline, marginLeft: spacing.lg }} />
          )}
          refreshing={busy}
          onRefresh={load}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      )}
    </SafeAreaView>
  );
}