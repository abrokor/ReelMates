import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { colors } from '../lib/colors';
import { spacing, typography } from '../lib/ui';

export default function Toast({ message }: { message: string }) {
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(a, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(a, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [a]);

  return (
    <Animated.View style={{
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      bottom: spacing.xl,
      transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
      opacity: a,
    }}>
      <View style={{
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222'
      }}>
        <Text style={[typography.body, { color: colors.textPrimary, textAlign: 'center' }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
