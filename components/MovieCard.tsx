import React from 'react';
import { Animated, Image, Pressable, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../lib/colors';
import { spacing, typography } from '../lib/ui';
import RatingBadge from './RatingBadge';

type RightAction = {
  label: string;
  loading?: boolean;
  onPress?: () => void;
};

type Props = {
  title: string;
  subtitle?: string;
  image?: string | null;
  rating?: number | null;
  onPress?: () => void;
  right?: RightAction; // <- config object, NOT rendered directly
  style?: any;
};

export default function MovieCard({
  title,
  subtitle,
  image,
  rating,
  onPress,
  right,
  style,
}: Props) {
  return (
    <View style={[{ width: '48%' }, style]}>
      <Pressable onPress={onPress} style={{ borderRadius: 16, overflow: 'hidden' }}>
        <View style={{ position: 'relative', backgroundColor: colors.surface, aspectRatio: 2 / 3, borderRadius: 16, overflow: 'hidden' }}>
          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: colors.surface }} />
          )}
          {typeof rating === 'number' && <RatingBadge value={rating} />}
        </View>
      </Pressable>

      <Text numberOfLines={1} style={{ marginTop: spacing.sm, color: colors.textPrimary, fontWeight: '700' }}>
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      ) : null}

      {right && (
        <TouchableOpacity
          onPress={right.onPress}
          disabled={right.loading}
          style={{
            marginTop: spacing.sm,
            alignSelf: 'flex-start',
            backgroundColor: colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 12,
            opacity: right.loading ? 0.6 : 1,
          }}
        >
          {right.loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: colors.background, fontWeight: '700' }}>{right.label}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
