// app/components/BigButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../lib/colors';
import { spacing } from '../lib/ui';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'surface' | 'secondary';
};

export default function BigButton({ label, onPress, variant = 'surface' }: Props) {
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
      activeOpacity={0.85}
      style={{
        backgroundColor: bg,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.hairline,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <Text
        style={{
          color: fg,
          fontSize: 18,
          fontWeight: '700',
          textAlign: 'center',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
