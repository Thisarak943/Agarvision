import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabBarBackground() {
  return (
    <BlurView
      tint="systemThickMaterialLight"
      intensity={95}
      style={StyleSheet.absoluteFillObject}
    />
  );
}
