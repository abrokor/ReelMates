import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, Button, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getDetails, imgUrl, MediaType } from "../../../lib/tmdb";
import { colors, spacing, typography } from "../../../lib/ui";
import { supabase } from "../../../lib/supabase";

export default function DetailsScreen() {
  const { media, id } = useLocalSearchParams<{ media: MediaType; id: string }>();
  const tmdbId = useMemo(() => Number(id), [id]);

  const [busy, setBusy] = useState(true);
  const [details, setDetails] = useState<any>(null);

  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setBusy(true);
        const d = await getDetails(media!, tmdbId);
        if (!cancelled) setDetails(d);
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load details");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => { cancelled = true; };
  }, [media, tmdbId]);

  // find if we already saved this exact media/id
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("saved_items")
        .select("id")
        .eq("media", media)
        .eq("tmdb_id", tmdbId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        if (error && error.code !== "PGRST116") console.warn(error.message);
        setRowId(data?.id ?? null);
      }
    })();
    return () => { cancelled = true; };
  }, [media, tmdbId]);

  async function onToggleSave() {
    try {
      setSaving(true);

      // Remove existing
      if (rowId) {
        const { error } = await supabase.from("saved_items").delete().eq("id", rowId);
        if (error) throw error;
        setRowId(null);
        Alert.alert("Removed", "Removed from Inbox");
        return;
      }

      // Add new
      const { data: { user } } = await supabase.auth.getUser();

      const title = details?.title ?? details?.name ?? "";
      const poster_path = details?.poster_path ?? null;
      const rating = details?.vote_average ?? null;

      const { data, error } = await supabase
        .from("saved_items")
        .insert({
          user_id: user?.id ?? null,   // ok w/ dev-open policies
          media,
          tmdb_id: tmdbId,
          title,
          poster_path,
          rating,
        })
        .select("id")
        .single();

      if (error) throw error;
      setRowId(data.id);
      Alert.alert("Saved", "Added to Inbox");
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  }

  if (busy) return <ActivityIndicator style={{ marginTop: spacing.lg }} />;

  const posterUri = imgUrl(details?.poster_path, "w342");

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      <Text style={typography.h1} numberOfLines={2}>
        {details?.title ?? details?.name ?? ""}
      </Text>

      <Text style={{ ...typography.body, marginTop: spacing.xs }}>
        {(String(details?.release_date ?? details?.first_air_date ?? "")).slice(0,4)}
      </Text>

      {posterUri ? (
        <Image
          source={{ uri: posterUri }}
          style={{ width: "100%", height: 450, borderRadius: 12, marginTop: spacing.md }}
          resizeMode="cover"
        />
      ) : null}

      <Text style={{ ...typography.body, marginTop: spacing.lg }}>
        {details?.overview ?? "No overview available."}
      </Text>

      <View style={{ marginTop: spacing.xl }}>
        <Button
          title={saving ? "Working..." : rowId ? "Remove from Inbox" : "Save to Inbox"}
          onPress={onToggleSave}
          disabled={saving}
          color={colors.primary}
        />
      </View>
    </ScrollView>
  );
}
