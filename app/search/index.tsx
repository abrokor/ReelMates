import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Pressable, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { searchTMDB, titleOf, yearOf } from "../../lib/tmdb";
import { colors, spacing, typography } from "../../lib/ui";

type TMDBItem = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
};

export default function SearchScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TMDBItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const h = setTimeout(async () => {
      if (!q.trim()) { setResults([]); setErr(null); return; }
      try {
        setLoading(true); setErr(null);
        const data = await searchTMDB(q.trim());
        setResults(data || []);
      } catch (e: any) {
        setErr(e?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(h);
  }, [q]);

  const saveToInbox = async (item: TMDBItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      tmdb_id: item.id,                 // ✅ correct column
      media_type: item.media_type,      // 'movie' | 'tv'
      title: titleOf(item),
      year: yearOf(item),
      source: "tmdb",
      payload: item,                    // jsonb
      user_id: user.id,                 // ✅ scope to user
    };

    // Build the insert object explicitly so no rogue keys sneak in
    const insertRow = {
      tmdb_id: payload.tmdb_id,
      media_type: payload.media_type,
      title: payload.title,
      year: payload.year,
      source: payload.source,
      payload: payload.payload,
      user_id: payload.user_id,
    };

    const { error } = await supabase.from("saved_items").insert(insertRow);
    if (error) {
      console.warn("saveToInbox error", error);
    }
  };

const openDetails = (item: TMDBItem) => {
  router.push({
    pathname: "/details/[media]/[id]",
    params: { media: item.media_type, id: String(item.id) },
  });
};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.lg }}>
      <TextInput
        placeholder="Search movies or TV"
        placeholderTextColor={colors.textSecondary}
        value={q}
        onChangeText={setQ}
        style={{
          color: colors.textPrimary,
          borderColor: colors.hairline,
          borderWidth: 1,
          borderRadius: 12,
          padding: spacing.md,
          marginBottom: spacing.md,
        }}
      />
      {loading && <ActivityIndicator /> }
      {!!err && <Text style={typography.body}>Error: {err}</Text>}

      <FlatList
        data={results}
        keyExtractor={(i) => `${i.media_type}-${i.id}`}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => (
          <View
            style={{
              padding: spacing.md,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.hairline,
            }}
          >
            <Pressable onPress={() => openDetails(item)}>
              <Text style={typography.h2}>{titleOf(item)} {yearOf(item) ? `(${yearOf(item)})` : ""}</Text>
              <Text style={typography.caption12}>{item.media_type}</Text>
            </Pressable>
            <View style={{ height: spacing.sm }} />
            <Pressable
              onPress={() => saveToInbox(item)}
              style={{
                alignSelf: "flex-start",
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                backgroundColor: colors.coral,
                borderRadius: 10,
              }}
            >
              <Text style={{ ...typography.button, color: colors.textOnCoral }}>Save to Inbox</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
