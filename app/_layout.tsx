import "~/polyfills";
import "~/styles/global.css";

import { Stack } from "expo-router";
import { AuthProvider } from "~/lib/authContext";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false, animation: "none" }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, animation: "none" }}
        />
      </Stack>
    </AuthProvider>
  );
}
