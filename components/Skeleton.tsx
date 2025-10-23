import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { colors } from '../../lib/colors';

type Props = {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle | ViewStyle[];
  radius?: number;
};

export default function Skeleton({ width = '100%', height = 16, style, radius = 12 }: Props) {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          opacity,
          backgroundColor: colors.surface,
          borderRadius: radius,
        },
        style as any,
      ]}
    />
  );
}
