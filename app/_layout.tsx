import "~/polyfills";
import "~/styles/global.css";

import { Stack } from "expo-router";
import { AuthProvider } from "~/lib/auth-context";
import { OnboardingProvider } from "~/lib/onboarding-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </OnboardingProvider>
    </AuthProvider>
  );
}
