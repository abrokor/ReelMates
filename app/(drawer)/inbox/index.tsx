import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import { colors, spacing, typography } from "../../../lib/ui";

type SavedItem = {
  id: string;
  media: "movie" | "tv" | null;
  tmdb_id: number | null;
  title: string;
  poster_path: string | null;
  created_at: string;
};

export default function InboxScreen() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("saved_items")
      .select("id, media, tmdb_id, title, poster_path, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("inbox load error", error);
      Alert.alert("Error", error.message ?? "Failed to load inbox");
      return;
    }
    setItems(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  async function onDelete(id: string) {
    const { error } = await supabase.from("saved_items").delete().eq("id", id);
    if (error) {
      Alert.alert("Delete failed", error.message ?? "Could not delete");
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  const renderItem = ({ item }: { item: SavedItem }) => (
    <MovieCard
      title={item.title}
      subtitle={item.media ? item.media.toUpperCase() : undefined}
      imagePath={item.poster_path ?? null}
      onPress={() => {
        if (!item.media || !item.tmdb_id) return;
        router.push(`/details/${item.media}/${item.tmdb_id}`);
      }}
      right={{ label: "Delete", onPress: () => onDelete(item.id) }}
    />
  );

  if (!items.length) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl }}>
        <Text style={typography.h1}>Inbox is empty</Text>
        <Text style={[typography.body, { marginTop: spacing.sm, color: colors.textSecondary }]}>
          Save a movie or show from Search to see it here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ItemSeparatorComponent={() => (
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.surface }} />
      )}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    />
  );
}
