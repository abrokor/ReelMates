import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { colors, spacing, typography } from '../../../lib/ui';
import { screenStyles } from '../../../lib/screen';

export default function FriendsScreen() {
  return (
    <SafeAreaView style={screenStyles.container}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h1, { color: colors.textPrimary }]}>Friends</Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
