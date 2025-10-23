import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography } from '../../../lib/ui';
import { screenStyles } from '../../../lib/screen';
import { supabase } from '../../../lib/supabase';

type Profile = {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const id = auth?.user?.id ?? null;
      setUserId(id);

      if (id) {
        const { data } = await supabase.from<Profile>('profiles')
          .select('id, username, bio, avatar_url')
          .eq('id', id)
          .maybeSingle();

        if (data) {
          setUsername(data.username ?? '');
          setBio(data.bio ?? '');
          setAvatarUrl(data.avatar_url ?? null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const pickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (res.canceled || !res.assets?.[0]) return;

    const asset = res.assets[0];
    const uri = asset.uri;
    const ext = (asset.fileName ?? 'avatar.jpg').split('.').pop()?.toLowerCase() || 'jpg';

    const path = `${userId}/${Date.now()}.${ext}`;
    const file = await fetch(uri).then(r => r.blob());

    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) return;

    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(publicUrl.publicUrl);
  };

  const saveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        username: username.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={screenStyles.background}>
      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        <Text style={[typography.body, { color: colors.textLight }]}>
          {loading ? 'Loading…' : 'Pick Avatar'}
        </Text>

        <Pressable onPress={pickAvatar} style={{ alignSelf: 'center' }}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              overflow: 'hidden',
              // ⬇️ old: colors.neutral.night800 — use a surface color for circles/cards
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Text style={{ color: colors.textSecondary }}>+</Text>
            )}
          </View>
        </Pressable>

        <View style={{ gap: spacing.sm }}>
          <Text style={[typography.caption12, { color: colors.textSecondary }]}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="yourname"
            placeholderTextColor="rgba(255,255,255,.5)"
            style={styles.input}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={[typography.caption12, { color: colors.textSecondary }]}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Say hi 👋"
            placeholderTextColor="rgba(255,255,255,.5)"
            style={styles.input}
          />
        </View>

        <Pressable onPress={saveProfile} disabled={saving} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnLabel}>{saving ? 'Saving…' : 'Save Profile'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    color: colors.textPrimary,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    // ⬇️ old: colors.neutral.hairline — use token
    borderColor: colors.hairline,
    backgroundColor: '#141820',
  },
  primaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    // Coral CTA
    backgroundColor: colors.coral,
  },
  primaryBtnLabel: {
    ...typography.button,
    // text on Coral per your tokens
    color: colors.textOnCoral,
    fontWeight: '600',
  },
});
