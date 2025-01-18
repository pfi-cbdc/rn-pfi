import { Stack } from 'expo-router';

export default function WelcomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcomeScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
