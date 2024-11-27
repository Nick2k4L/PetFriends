import { Stack } from 'expo-router';

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="auth/LoginScreen" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default StackLayout;
