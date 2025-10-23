// app/_components/HeaderButtons.tsx
import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export function BackButton({ tintColor }: { tintColor?: string }) {
  const nav = useNavigation();
  return (
    <Pressable
      onPress={() => {
        // @ts-ignore
        if (nav.canGoBack && nav.canGoBack()) nav.goBack();
        else nav.navigate('index' as never);
      }}
      style={{ paddingHorizontal: 12, paddingVertical: 6 }}
    >
      <Ionicons name="chevron-back" size={24} color={tintColor ?? '#fff'} />
    </Pressable>
  );
}
