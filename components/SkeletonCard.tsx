import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '../lib/colors';
import { spacing } from '../lib/ui';

export default function SkeletonCard() {
  const opacity = React.useRef(new Animated.Value(0.45)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View
      style={{
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: spacing.md,
      }}
    >
      <Animated.View style={{ aspectRatio: 2 / 3, backgroundColor: colors.surfaceDark, opacity }} />
      <View style={{ padding: spacing.md, gap: 8 }}>
        <Animated.View style={{ height: 14, borderRadius: 8, backgroundColor: colors.surfaceDark, opacity }} />
        <Animated.View style={{ width: '60%', height: 12, borderRadius: 8, backgroundColor: colors.surfaceDark, opacity }} />
      </View>
    </View>
  );
}
