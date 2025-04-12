import "~/polyfills";
import "~/styles/global.css";

import { useEffect } from "react";
import { Stack, useRouter, useSegments, SplashScreen } from "expo-router";
import { AuthProvider, useAuth } from "~/lib/auth-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// This function ensures that users are directed to the right screens based on their authentication status
function RootLayoutNav() {
  const { user, isGuest, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (loading) return;

    // Check if the user is on an auth screen
    const inAuthGroup = segments[0] === 'auth';
    
    // dummy code but it works :))))
    // Allow access to main app if user is logged in or in guest mode
    if (!user && !isGuest && !inAuthGroup) {
      // Redirect to login if user is not logged in, not in guest mode, and not on an auth screen
      router.replace('/auth/login');
    } else if ((user || isGuest) && inAuthGroup) {
      // Redirect to home if user is logged in or in guest mode and tries to access auth screens
      router.replace('/');
    }
  
    
    // Hide splash screen once authentication is determined
    SplashScreen.hideAsync();
    
  }, [user, isGuest, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
