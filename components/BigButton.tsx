// components/BigButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../lib/colors';
import { spacing, typography } from '../lib/ui';

type Props = {
  label: string;
  onPress?: () => void;
  /** UI look */
  variant?: 'surface' | 'primary' | 'secondary';
};

export default function BigButton({ label, onPress, variant = 'surface' }: Props) {
  // 'secondary' uses our primary color too (we don't have a dedicated secondary color)
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'secondary'
      ? colors.primary
      : colors.surface;

  const fg = variant === 'surface' ? colors.textPrimary : '#ffffff';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 16,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: colors.hairline,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      }}
    >
      <Text style={{ ...typography.button, color: fg }}>{label}</Text>
    </TouchableOpacity>
  );
}
