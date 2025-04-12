import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useOnboarding } from "~/lib/onboarding-context";

export default function Index() {
  const { hasSeenOnboarding, loading } = useOnboarding();
  const router = useRouter();

  // Show loading spinner while checking the onboarding status
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Direct first-time users to onboarding
  if (!hasSeenOnboarding) {
    return <Redirect href="/(tabs)/onboarding" />;
  }

  // Return users go to home
  return <Redirect href="/(tabs)/home" />;
}
