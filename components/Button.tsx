import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../lib/colors';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'ghost';
};

export default function Button({
  title,
  onPress,
  disabled,
  style,
  textStyle,
  variant = 'primary',
}: Props) {
  const bg = variant === 'primary' ? colors.primary : 'transparent';
  const fg = variant === 'primary' ? colors.background : colors.textPrimary;
  const border = variant === 'ghost' ? { borderWidth: 1, borderColor: colors.surfaceDark } : undefined;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          backgroundColor: disabled ? '#2f2f2f' : bg,
          opacity: pressed ? 0.85 : 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        border,
        style,
      ]}
    >
      <Text style={[{ color: fg, fontWeight: '700' }, textStyle]}>{title}</Text>
    </Pressable>
  );
}
