import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="chat"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="health-report"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="healthcare-providers"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="provider-detail"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
