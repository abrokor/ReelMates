import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { colors } from ".././../lib/ui";

export function DrawerButton() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Open menu"
    >
      <Ionicons name="menu" size={24} color={colors.textPrimary} />
    </Pressable>
  );
}

export function BackButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
    </Pressable>
  );
}

// Router scan pacifier (no UI)
export default function __HeaderButtonsRoute__() { return null; }
