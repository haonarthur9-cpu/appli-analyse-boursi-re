import Animated, { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

export function HelloWave() {
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(25, {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
      }),
      4,
      true
    );
  }, []);

  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        transform: [{ rotate: rotation.value + 'deg' }],
      }}>
      👋
    </Animated.Text>
  );
}
