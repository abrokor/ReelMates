import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { colors, spacing, typography } from "../../../lib/ui";
import {
  TMDBItem,
  searchTMDB,
  titleOf,
  yearOf,
  imgUrl,
} from "../../../lib/tmdb";

/**
 * Debounce helper so we don't hammer the API while typing.
 */
function useDebounced<T>(value: T, delay = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(""); // optional
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<TMDBItem[]>([]);
  const [touched, setTouched] = useState(false); // show "No results" only after first fetch

  const q = useDebounced(query.trim());
  const y = useDebounced(year.trim());

  // Whether we have enough input to try searching
  const canSearch = useMemo(() => {
    if (q.length >= 2) return true;          // title-only search
    if (y.length === 4 && /^\d{4}$/.test(y)) return true; // year-only search
    return false;
  }, [q, y]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!canSearch) {
        setResults([]);
        return;
      }
      setBusy(true);
      try {
        let list: TMDBItem[] = [];

        // If a title is present, use our normal helper, optionally passing year.
        if (q.length >= 2) {
          const yr = y.length === 4 ? Number(y) : undefined;
          list = await searchTMDB(q, yr);
        } else {
          // Year-only search. Use a very broad title to get popular titles,
          // then client-filter by year. (Keeps changes local to this screen.)
          const tmp = await searchTMDB("a"); // minimal token to satisfy API
          const wanted = y;
          list = (tmp ?? []).filter((it) => {
            const yr = yearOf(it);
            return yr && String(yr) === wanted;
          });
        }

        if (!cancelled) {
          setResults(list ?? []);
          setTouched(true);
        }
      } catch (e: any) {
        if (!cancelled) {
          setResults([]);
          setTouched(true);
          // Optional: you can surface an Alert here if you want.
          console.warn("Search failed", e?.message ?? e);
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [canSearch, q, y]);

  function openDetails(item: TMDBItem) {
    Keyboard.dismiss();
    router.push({
      pathname: "/details/[media]/[id]",
      params: { media: item.media_type, id: String(item.id) },
    });
  }

  const renderItem = ({ item }: { item: TMDBItem }) => {
    const poster = item.poster_path ? imgUrl(item.poster_path, "w154") : null;

    return (
      <Pressable
        onPress={() => openDetails(item)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        }}
      >
        {poster ? (
          <Image
            source={{ uri: poster }}
            style={{ width: 60, height: 90, borderRadius: 6, marginRight: spacing.md }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 90,
              borderRadius: 6,
              marginRight: spacing.md,
              backgroundColor: colors.card,
            }}
          />
        )}

        <View style={{ flex: 1 }}>
          <Text style={[typography.body, { color: colors.text }]} numberOfLines={1}>
            {titleOf(item) ?? "Untitled"}
          </Text>
          <Text
            style={[typography.caption12, { color: colors.muted, marginTop: 4 }]}
            numberOfLines={1}
          >
            {String(yearOf(item) ?? "")}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          gap: spacing.sm,
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Title (e.g., Up)"
          placeholderTextColor={colors.muted}
          style={{
            ...typography.body,
            color: colors.text,            // <— visible while typing
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
          returnKeyType="search"
        />

        <TextInput
          value={year}
          onChangeText={(t) => setYear(t.replace(/[^\d]/g, "").slice(0, 4))}
          placeholder="Year (optional, e.g., 2009)"
          placeholderTextColor={colors.muted}
          style={{
            ...typography.body,
            color: colors.text,
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          }}
          keyboardType="number-pad"
          returnKeyType="search"
        />
      </View>

      {busy ? (
        <ActivityIndicator style={{ marginTop: spacing.lg }} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(it) => `${it.media_type}:${it.id}`}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.hairline }} />
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      ) : touched && canSearch ? (
        <View style={{ padding: spacing.lg }}>
          <Text style={[typography.body, { color: colors.muted }]}>No results.</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}