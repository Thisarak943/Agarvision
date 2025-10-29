// components/HapticTab.tsx - New component for haptic feedback
import { type ComponentProps } from 'react';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

type Props = ComponentProps<typeof Pressable> & {
  children: React.ReactNode;
};

export function HapticTab({ children, ...props }: Props) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}>
      {children}
    </Pressable>
  );
}