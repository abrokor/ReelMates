import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { colors, typography } from '../../lib/ui';
import { DrawerButton } from '../components/HeaderButtons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: typography.h2 as any,
        headerLeft: () => <DrawerButton />,
      }}
    />
  );
}
