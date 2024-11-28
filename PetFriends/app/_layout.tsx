// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(non-tabs)/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(non-tabs)/PetManagementScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
