import "~/polyfills";
import "~/styles/global.css";

import { Stack } from "expo-router";
import { AuthProvider } from "~/lib/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
