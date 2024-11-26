import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  transparent?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  transparent = true, // Default to true
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = transparent
    ? 'transparent'
    : useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
