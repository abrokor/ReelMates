import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../lib/ui';

export default function RatingBadge({ value }: { value: number }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{value.toFixed(1)}★</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 28, paddingHorizontal: spacing.md, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  label: { ...typography.caption12, color: colors.textPrimary, fontWeight: '700' as const },
});
